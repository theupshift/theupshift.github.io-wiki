const Runic = require('../lib/runic');
const Template = require('./template');
const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

function displayDate (d) {
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

module.exports = function ({term, unde, type, line}, data) {
  Template.call(this, {term, unde, type, line});
  this.path = `./wiki/${this.filename}.html`;

  function _summary () {
    const dur = data.listDurations();
    const sv = data.sortValues();

    let html = `<div id="i"><table><tbody><tr><td>${displayDate(data.logs[0].start)}&ndash;${displayDate(data.logs.slice(-1)[0].end)}<td class="ar">${data.count} logs<td class="ar">${data.lh.toFixed(2)} h</table><table><tbody>`;

    function translate (x) {
      switch (x) {
        case 'DV': return 'Development';
        case 'VI': return 'Visual';
        case 'RE': return 'Research';
        case 'MN': return 'Maintenance';
        case 'PY': return 'Physical';
        case 'AU': return 'Audio';
        default: return x;
      }
    }

    for (let i = 0, l = sv.length; i < l; i++) {
      const {h, p, n} = sv[i];
      html += `<tr><td>${translate(n)}<td><meter max="100" value="${p.toFixed(2)}"></meter><td class="ar">${h.toFixed(2)} h`;
    }

    return `${html}</table></div>`;
  }

  this.render = () => {
    return `${this.head()}<body><div id="v">${this.header()}<main id="c">${this.core(this.id, this.parent)}${data.logs.length !== 0 ? _summary() : ''}</main>${this.footer()}</div><script src="../search.js"></script>`;
  }
}
