const Runic = require('../lib/runic');
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

function displayDate (d) {
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

module.exports = function Page ({term, unde, type, line}, data) {
  this.id = term.toLowerCase();
  this.parent = unde || 'home';
  this.filename = this.id.toUrl();
  this.path = `./wiki/${this.filename}.html`;

  function _template (acc, term) {
    return `${Array.isArray(line[term]) ? new Runic(line[term]).parse() : line[term]}`;
  }

  function _core (id, parent, content) {
    return `${Object.keys(line).reduce(_template, '')}`.trim()
  }

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
    const parentURL = parent === 'Home' ? '../index.html' : `./${parent.toUrl()}`;

    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="author" content="Josh Avanier"><title>${id.toCapitalCase()}</title><link rel="stylesheet" href="../s.css"/></head><body><div id="v"><p id="u"><a href="${parentURL}">${parent.toCapitalCase()}</a></p><input id="s" value="${id.toCapitalCase()}" spellcheck="false"><main id="c">${_core(id, parent)}${data.logs.length !== 0 ? _summary() : ''}</main><footer id="f"><a href="http://webring.xxiivv.com/#random" target="_blank"><img id="w" src="./img/rotonde.svg"></a><p><a href="./josh.html">Josh Avanier</a> © Éternité</footer></div><script src="./search.js"></script></body></html>`;
  }
}
