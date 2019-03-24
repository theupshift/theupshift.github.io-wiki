function sum (v = []) {
  const l = v.length
  if (l === 0) return 0
  let x = 0
  for (let i = 0; i < l; i++) x += v[i]
  return x
}

const convertHex = h => parseInt(h, 16)

module.exports = class LogSet {

  constructor(ent = []) { this.logs = ent }
  get count () { return this.logs.length }
  get last  () { return this.logs.slice(-1)[0] }
  get lh    () { return this.logHours() }

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

  listDurations () {
    const d = []
    const l = this.count
    if (l === 0) return d
    const n = this.last.end === undefined ? 2 : 1
    for (let i = l - n; i >= 0; i--)
      d[d.length] = this.logs[i].dur
    return d
  }

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

  listSectors () {
    const l = this.count
    if (l === 0) return []

    const n = this.last.end === undefined ? 2 : 1
    const list = new Set()

    for (let i = l - n; i >= 0; i--)
      list.add(this.logs[i].sector)

    return [...list]
  }

  logHours () {
    return this.count === 0 ? 0 : sum(this.listDurations())
  }

  sortEntries (end = new Date) {
    const el = this.count
    if (el === 0) return []

    const list = listDates(this.logs[0].start, end)
    const dates = {}

    for (let i = 0, l = list.length; i < l; i++)
      dates[list[i].toDate()] = []

    for (let i = 0; i < el; i++) {
      const x = this.logs[i].start.toDate()
      x in dates && (dates[x][dates[x].length] = this.logs[i])
    }

    return Object.keys(dates).map(i => dates[i])
  }

  sortValues () {
    if (this.count === 0) return []

    const lhe = this.lh, sorted = [], tmp = {}
    const list = this.listSectors()
    let hours = [], percs = []

    for (let i = list.length - 1; i >= 0; i--) {
      const lh = new LogSet(this.bySector(list[i])).lh
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
