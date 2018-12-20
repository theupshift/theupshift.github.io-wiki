const Runic = require('../lib/runic');
const Template = require('./template');

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

function displayDate (d) {
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

module.exports = function ({term, unde, type, line}, data) {
  Template.call(this, {term, unde, type, line});
  this.path = `./wiki/${this.filename}.html`;

  function _summary () {
    const dur = data.listDurations();
    const sv = data.sortValues();

    let html = `<div id="i">
    <table>
      <tbody>
        <tr>
          <td>${displayDate(data.logs[0].start)}&ndash;${displayDate(data.logs.slice(-1)[0].end)}</td>
          <td class="ar">${data.count} logs</td>
          <td class="ar">${data.lh.toFixed(2)} h</td>
        </tr>
      </tbody>
    </table>
    <table>
    <tbody>
    `;

    for (let i = 0, l = sv.length; i < l; i++) {
      const {h, p} = sv[i];
      let n = '';
      switch (sv[i].n) {
        case 'DV': n = 'Development'; break;
        case 'VI': n = 'Visual'; break;
        case 'RE': n = 'Research'; break;
        case 'MN': n = 'Maintenance'; break;
        case 'PY': n = 'Physical'; break;
        case 'AU': n = 'Audio'; break;
        default: break;
      }
      html += `<tr><td>${n}</td><td><meter max="100" value="${p.toFixed(2)}"></meter></td><td class="ar">${h.toFixed(2)} h</td></tr>`;
    }

    return `${html}</tbody></table></div>`;
  }

  this.render = () => {
    const {id, parent} = this;
    const parentURL = parent === 'Home' ? '../index.html' : `./${parent.toUrl()}.html`;

    return `${this.head()}<body><div id="v">${this.header()}<main id="c">${this.core(id, parent)}${data.logs.length !== 0 ? _summary() : ''}</main>${this.footer()}</div><script src="../search.js"></script></body></html>`;
  }
}
