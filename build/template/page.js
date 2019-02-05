const Template = require('./template');
const Aequirys = require('aequirys');

const _dd = d => new Aequirys(d).display();
const _hv = d => `${d.getDate()}&middot;${d.getMonth() + 1}&middot;${d.getFullYear()}`;

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
      html += ` &middot; ${h.toFixed(2)} <span title="${sectors[n]}">${n}</span>`;
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
      ` &middot; ${d.lh.toFixed(2)} h`,
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
