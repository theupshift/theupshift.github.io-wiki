
const duration = (s, e) => e === undefined ? 0 : (+e - +s) / 36E5

module.exports = class Entry {

  constructor(attr) {
    Object.assign(this, attr)
    this.dur = duration(this.s, this.e)
  }

  get start   () { return this.s }
  get end     () { return this.e }
  get sector  () { return this.c }
  get project () { return this.t }

  get wh () { return this.calcWidth() }
  get mg () { return this.calcMargin() }
}
