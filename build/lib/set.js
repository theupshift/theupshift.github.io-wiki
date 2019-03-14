/**
 * Add leading zeroes
 * @return {string}
 */
Number.prototype.pad = function () {
  return `0${this}`.substr(-2)
}

/**
 * Calculate sum
 * @param {Array=} v - Values
 * @return {number} Sum
 */
function sum (v = []) {
  const l = v.length
  if (l === 0) return 0
  let x = 0
  for (let i = 0; i < l; i++) x += v[i]
  return x
}

/**
 * Add days to date
 * @param {number=} i - Increment
 * @return {Date}
 */
Date.prototype.addDays = function (i = 1) {
  const d = new Date(this.valueOf())
  d.setDate(d.getDate() + i)
  return d
};

/**
 * Convert to date ID
 * @return {string} YYYYMMDD
 */
Date.prototype.toDate = function () {
  const y = this.getFullYear()
  const m = this.getMonth().pad()
  const d = this.getDate().pad()
  return `${y}${m}${d}`
}

/**
 * Convert hexadecimal to decimal
 * @param {string} h
 * @return {number} Decimal
 */
function convertHex (h) {
   return parseInt(h, 16)
}

/**
 * Calculate duration
 * @param {Date} s - Start
 * @param {Date} e - End
 * @return {number} Duration (1 = 1h)
 */
function duration (s, e) {
  return e === undefined ? 0 : (+e - +s) / 36E5
}

/**
 * List dates
 * @param {Date}  s - Start
 * @param {Date=} e - End
 * @return {Array} List
 */
function listDates (s, e = new Date) {
  const l = []

  let n = new Date(s)
  n.setHours(0, 0, 0, 0)

  for (; n <= e;) {
    l[l.length] = n
    n = n.addDays(1)
  }

  return l
}

module.exports = class LogSet {

  /**
   * Construct set
   * @param {Array=} ent
   */
  constructor(ent = []) {
    this.logs = ent
  }

  get count () { return this.logs.length }
  get last ()  { return this.logs.slice(-1)[0] }
  get lh ()    { return this.logHours() }

  get avgLh() {return avg(this.listDurations())}

  lastUpdated () {
    return this.last.end.ago()
  }

  /**
   * Get logs by project
   * @param {string} term - Project
   * @param {Array=} list - Projects
   * @return {Array} Entries
   */
  byProject (term, list = this.listProjects()) {
    if (
      this.count === 0
      || typeof term !== 'string'
      || !Array.isArray(list)
      || list.indexOf(term) < 0
    ) return []
    return this.logs.filter(({end, project}) =>
      end !== undefined && project === term
    )
  }

  /**
   * Get logs by sector
   * @param {string} term - Sector
   * @param {Array=} list - Sectors
   * @return {Array} Entries
   */
  bySector (term, list = this.listSectors()) {
    if (
      this.count === 0
      || typeof term !== 'string'
      || !Array.isArray(list)
      || list.indexOf(term) < 0
    ) return []
    return this.logs.filter(({end, sector}) =>
      end !== undefined && sector === term
    )
  }

  /**
   * Calculate average log hours per day
   * @return {number} Average log hours
   */
  dailyAvg () {
    const se = this.sortEntries()
    const l = se.length
    return l === 0 ? 0 :
      se.reduce((s, c) => s + new LogSet(c).lh, 0) / l
  }

  /**
   * List durations
   * @return {Array} List
   */
  listDurations () {
    const d = []
    const l = this.count
    if (l === 0) return d
    const n = this.last.end === undefined ? 2 : 1
    for (let i = l - n; i >= 0; i--) {
      d[d.length] = this.logs[i].dur
    }
    return d
  }

  /**
   * List projects
   * @return {Array} List
   */
  listProjects () {
    const l = this.count
    if (l === 0) return []

    const n = this.last.end === undefined ? 2 : 1
    const list = new Set()

    for (let i = l - n; i >= 0; i--) {
      list.add(this.logs[i].project)
    }

    return [...list]
  }

  /**
   * List sectors
   * @return {Array} List
   */
  listSectors () {
    const l = this.count
    if (l === 0) return []

    const n = this.last.end === undefined ? 2 : 1
    const list = new Set()

    for (let i = l - n; i >= 0; i--) {
      list.add(this.logs[i].sector)
    }

    return [...list]
  }

  /**
   * Calculate logged hours
   * @return {number} Logged hours
   */
  logHours () {
    return this.count === 0 ? 0 : sum(this.listDurations())
  }

  /**
   * Sort entries
   * @param {Date=} end
   * @return {Array} Sorted entries
   */
  sortEntries (end = new Date) {
    const el = this.count
    if (el === 0) return []

    const list = listDates(this.logs[0].start, end)
    const dates = {}

    for (let i = 0, l = list.length; i < l; i++) {
      dates[list[i].toDate()] = []
    }

    for (let i = 0; i < el; i++) {
      const x = this.logs[i].start.toDate()
      x in dates && (dates[x][dates[x].length] = this.logs[i])
    }

    return Object.keys(dates).map(i => dates[i])
  }

  /**
   * TODO
   * Sort values
   * @param {number=} mode - Sector (0) | project (1)
   * @return {Array} Sorted values
   */
  sortValues (mode = 0) {
    if (
      this.count === 0
      || typeof mode !== 'number'
      || mode < 0 || mode > 1
    ) return []

    const lhe = this.lh
    const sorted = []
    const tmp = {}
    let list = []
    let func = ''

    if (mode === 0) {
      list = this.listSectors()
      func = 'bySector'
    } else {
      list = this.listProjects()
      func = 'byProject'
    }

    let hours = [], percs = []

    for (let i = list.length - 1; i >= 0; i--) {
      const lh = new LogSet(this[func](list[i])).lh
      tmp[list[i]] = {p: lh / lhe * 100, h: lh}
    }

    const keys = Object.keys(tmp).sort((a, b) => tmp[a].h - tmp[b].h)
    for (let i = keys.length - 1; i >= 0; i--) {
      const {h, p} = tmp[keys[i]]
      sorted[sorted.length] = {h, p, n: keys[i]}
    }

    return sorted
  }
}
