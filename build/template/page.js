const Template = require('./template');
const Aequirys = require('aequirys');

const _p = n => `0${n}`.substr(-2);
const _dd = d => {
  const a = new Aequirys(d);
  const y = Math.abs(17 - +a.year.toString().slice(-2)) + 1;
  const m = a.month;
  const x = (+a.date).toString(15).toUpperCase();
  return `${x}${m}${y}`;
}
const _hv = d => `${_p(d.getDate())}${_p(d.getMonth() + 1)}${d.getFullYear().toString().slice(-2)}`;

const sectors = {
  'DV': 'Development',
  'RE': 'Research',
  'PY': 'Physical',
  'VI': 'Visual',
  'AU': 'Audio'
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
      html += ` · <span title="${sectors[n]}">${h.toFixed(2)}${n[0]}</span>`;
    }
    return html;
  }

  /**
   * Build Summary
   * @return {string} Summary
   */
  function _sum (d = data) {
    const sd = d.logs[0].start;
    const ed = d.logs.slice(-1)[0].end;

    return [
      `<div id="l"><span title="${_hv(sd)}&ndash;${_hv(ed)}">`,
      `${_dd(sd)}&ndash;${_dd(ed)}</span>`,
      ` · ${d.lh.toFixed(2)}`,
      `${_sh(d.sortValues())}</div>`
    ].join('');
  }

  /**
   * Render Page
   * @return {string} Content
   */
  this.render = () => {
    return [
      this.head(), this.header(),
      `<main>${data.logs.length > 0 ? _sum() : ''}`,
      `${this.core()}</main>`,
      this.footer(), this.search()
    ].join('');
  }
}
