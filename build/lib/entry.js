/**
 * Calculate duration
 * @param {Date} s - Start
 * @param {Date} e - End
 * @return {number} Duration (1 = 1h)
 */
function duration (s, e) {
  return e === undefined ? 0 : (+e - +s) / 36E5
}

module.exports = class Entry {

  /**
   * Construct an entry
   * @param {Object} attr
   * @param {number} attr.id - Entry ID
   * @param {Date}   attr.s  - Start time
   * @param {Date}   attr.e  - End time
   * @param {string} attr.c  - Sector
   * @param {string} attr.t  - Project
   */
  constructor(attr) {
    Object.assign(this, attr)
    this.dur = duration(this.s, this.e)
  }

  get start ()   { return this.s }
  get end ()     { return this.e }
  get sector ()  { return this.c }
  get project () { return this.t }

  get wh () { return this.calcWidth() }
  get mg () { return this.calcMargin() }

  /**
   * Calculate left margin
   * @return {number} Margin
   */
  calcMargin () {
    const d = this.start
    const m = new Date(d).setHours(0, 0, 0)
    return (+d - +m) / 864E3
  }

  /**
   * Calculate duration width
   * @return {number} Width
   */
  calcWidth () {
    return this.dur * 25 / 6
  }
}
