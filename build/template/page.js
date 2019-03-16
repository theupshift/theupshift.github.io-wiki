const Template = require('./template')
const Aequirys = require('aequirys')
module.exports = function ({term, root, type, fin, line}, data) {
  Template.call(this, {term, root, type, line})
  this.path = `./wiki/${this.file}.html`

  const _p = n => `0${n}`.substr(-2)

  const _dd = d => {
    const a = new Aequirys(d)
    const y = new Date().getFullYear() - +a.year
    const m = a.month
    const x = (+a.date).toString(15).toUpperCase()
    return `${x}${m}${y === 0 ? '' : y}`
  }

  const _hv = d => `${_p(d.getDate())}${_p(d.getMonth() + 1)}${d.getFullYear().toString().slice(-2)}`

  /**
   * Display project hours
   * @param {Array} sv - Sorted values
   * @return {string} Sector hours
   */
  function _ph (sv) {
    let html = '', sum = 0
    const l = sv.length

    if (l === 1) {
      const {h, n} = sv[0]
      return `<span>${h.toFixed(1)}${n}</span>`
    }

    for (let i = 0, l = sv.length; i < l; i++) {
      const {h, n} = sv[i]
      sum += h
      html += ` <span">${n}${h.toFixed(1)}</span>`
    }

    return `${sum.toFixed(1)}${html}`
  }

  /**
   * Build Summary
   * @return {string} Summary
   */
  function _sum () {
    const sd = data.logs[0].start
    const ed = data.logs.slice(-1)[0].end

    return [
      `<div id="l"><span title="${_hv(sd)}–${_hv(ed)}">`,
      `${_dd(sd)} ${_dd(ed)}</span>`,
      ` ${_ph(data.sortValues())}</div>`
    ].join('')
  }

  /**
   * Render Page
   * @return {string} Content
   */
  this.render = () => {
    return [
      this.head(), this.header(),
      `<main>${this.core()}`,
      `${data.logs.length > 0 ? _sum() : ''}</main>`,
      this.footer()
    ].join('')
  }
}
