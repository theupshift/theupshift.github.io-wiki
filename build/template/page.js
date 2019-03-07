const Template = require('./template');
const Aequirys = require('aequirys');

const _p = n => `0${n}`.substr(-2);
const _dd = d => {
  const a = new Aequirys(d);
  const y = Math.abs(2017 - +a.year) + 1;
  const m = a.month;
  const x = (+a.date).toString(15).toUpperCase();
  return `${x}${m}${y}`;
}
const _hv = d => `${_p(d.getDate())}${_p(d.getMonth() + 1)}${d.getFullYear().toString().slice(-2)}`;

const sectors = {
  'D': 'Development',
  'R': 'Research',
  'P': 'Physical',
  'V': 'Visual',
  'A': 'Audio'
}

module.exports = function ({term, root, type, line}, data) {
  Template.call(this, {term, root, type, line});
  this.path = `./wiki/${this.file}.html`;

  /**
   * Display sector hours
   * @param {Array} sv - Sorted values
   * @return {string} Sector hours
   */
  function _sh (sv) {
    let html = '';
    for (let i = 0, l = sv.length; i < l; i++) {
      const {h, n} = sv[i];
      html += ` <span title="${sectors[n]}">${h.toFixed(1)}${n}</span>`;
    }
    return html;
  }

  /**
   * Build Summary
   * @return {string} Summary
   */
  function _sum () {
    const sd = data.logs[0].start;
    const ed = data.logs.slice(-1)[0].end;

    return [
      `<div id="l"><span title="${_hv(sd)}&ndash;${_hv(ed)}">`,
      `${_dd(sd)}${_dd(ed)}</span>`,
      ` ${data.lh.toFixed(1)}`,
      `${_sh(data.sortValues())}</div>`
    ].join('');
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
      this.footer(), this.search()
    ].join('');
  }
}
