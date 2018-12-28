const Template = require('./template');
const Utils = require('../lib/utils');
const Aequirys = require('aequirys');

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
const displayDate = d => new Aequirys(d).display();
const hoverDate = d => `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

module.exports = function ({term, unde, type, line}, data) {
  Template.call(this, {term, unde, type, line});
  this.path = `./wiki/${this.filename}.html`;

  const sectors = {
    'DV': 'Development',
    'MN': 'Maintenance',
    'RE': 'Research',
    'PY': 'Physical',
    'VI': 'Visual',
    'AU': 'Audio'
  }

  function _summary () {
    const sv = data.sortValues();
    const sd = data.logs[0].start;
    const ed = data.logs.slice(-1)[0].end;

    let html = `<div id="l"><p><span title="${hoverDate(sd)}&ndash;${hoverDate(ed)}">${displayDate(sd)}&ndash;${displayDate(ed)}</span> &middot; ${data.count} logs &middot; ${data.lh.toFixed(2)} h`;

    for (let i = 0, l = sv.length; i < l; i++) {
      const {h, n} = sv[i];
      html += ` &middot; <span title="${sectors[n]}">${h.toFixed(2)} ${n}</span>`;
    }

    return `${html}</div>`;
  }

  this.render = () => {
    return Utils.merge([
      this.head(),
      '<body>',
      this.header(),
      '<div id="c">',
      this.core(),
      data.logs.length > 0 ? _summary() : '',
      '</div>',
      this.footer(),
      this.search()
    ]);
  }
}
