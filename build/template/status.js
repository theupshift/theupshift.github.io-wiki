const Runic = require('../lib/runic');

module.exports = function StatusPage ({term, unde, type, line}) {
  this.id = term.toLowerCase();
  this.parent = unde || 'home';
  this.filename = this.id.toUrl();
  this.path = `./joshavanier.github.io/${this.filename}.html`;

  function _template (acc, term) {
    return `${Array.isArray(line[term]) ? new Runic(line[term]).parse() : line[term]}`;
  }

  function _core (id, parent, content) {
    return `${Object.keys(line).reduce(_template, '')}`.trim()
  }

  function makeIndex (lexicon = database) {
    const {home, index, page, portal, status} = organiseByType(lexicon);
    return makeIndexTable(index)
      + makePortalTable(portal)
      + makePageTable(page);
  }

  function makeIndexTable (index) {
    let html = `
      <table><thead><tr>
      <th>Index</th><th class="ac">IN</th><th class="ac">MD</th><th class="ar">WC</th>
      <th class="ar">CI</th></tr></thead><tbody>`;
    let wc = wordCount(index);
    for (let i = 0; i < index.length; i++) {
      const {term, line, type} = index[i];
      const long = new Runic(line['$']).html();
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const CI = completenessIndex(x, y);
      const indx = calcIndex(CI, 2);

      html += `
        <tr><td><a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a></td>
        <td class="ac">${x ? '+' : '-'}</td>
        <td class="ac">${y ? '+' : '-'}</td>
        <td class="ar">${wc[i]}</td>
        <td class="ar">${indx.toFixed(2)}</td></tr>
      `;
    }
    return `${html}</tbody></table>`;
  }

  function makePortalTable (portal) {
    let html = `
      <table><thead><tr>
      <th>Portal</th><th class="ac">IN</th><th class="ac">MD</th><th class="ar">WC</th>
      <th class="ar">CI</th></tr></thead><tbody>`;
    let wc = wordCount(portal);
    for (let i = 0; i < portal.length; i++) {
      const {term, line, type} = portal[i];
      const long = new Runic(line['$']).html();
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const CI = completenessIndex(x, y);
      const indx = calcIndex(CI, 2);

      html += `
        <tr><td><a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a></td>
        <td class="ac">${x ? '+' : '-'}</td>
        <td class="ac">${y ? '+' : '-'}</td>
        <td class="ar">${wc[i]}</td>
        <td class="ar">${indx.toFixed(2)}</td></tr>
      `;
    }
    return `${html}</tbody></table>`;
  }

  function makePageTable (page) {
    let html = makeTableHeader();
    let wc = wordCount(page);
    for (let i = 0; i < page.length; i++) {
      const {term, line, type} = page[i];
      const long = new Runic(line['$']).html();
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const z = long.indexOf('<a') > -1;
      const CI = completenessIndex(x, y, z);
      const indx = calcIndex(CI, 3);

      html += `
        <tr><td><a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a></td>
        <td class="ac">${x ? '+' : '-'}</td>
        <td class="ac">${y ? '+' : '-'}</td>
        <td class="ac">${z ? '+' : '-'}</td>
        <td class="ar">${wc[i]}</td>
        <td class="ar">${indx.toFixed(2)}</td></tr>
      `;
    }
    return `${html}</tbody></table>`;
  }

  function makeTableHeader () {
    return `
      <table><thead><tr><th>Page</th><th class="ac">IN</th>
      <th class="ac">MD</th><th class="ac">LN</th>
      <th class="ar">WC</th><th class="ar">CI</th>
      </tr></thead><tbody>`;
  }

  function organiseByType (lexicon = database) {
    const types = {};
    for (let key in lexicon) {
      const {type, name} = lexicon[key];
      if (types[type] === undefined) types[type] = [];
      types[type][types[type].length] = lexicon[key];
    }
    return types;
  }

  function completenessIndex (...points) {
    let index = 0;
    for (let i = 0; i < points.length; i++) {
      if (points[i]) index++;
    }
    return index;
  }

  function calcIndex (CI, maxPoints) {
    return CI === 0 ? 0 : CI / maxPoints;
  }

  function wordCount (lexicon = database) {
    let wc = [];
    for (key in lexicon) {
      const {name, line} = lexicon[key];
      const long = new Runic(line['$']).html();
      wc[wc.length] = long.length === 0
        ? 0 : long.split(' ').length;
    }
    return wc;
  }

  this.render = () => {
    const {id, parent} = this;
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="author" content="Josh Avanier"><title>${id.toCapitalCase()}</title><link rel="stylesheet" href="./s.css"/></head><body><div id="v"><p id="u"><a href="./${parent.toUrl()}.html">${parent.toCapitalCase()}</a><input id="s" value="${id.toCapitalCase()}" spellcheck="false"><main id="c">${_core(id, parent)}${makeIndex()}</main><footer id="f"><a href="http://webring.xxiivv.com/#random" target="_blank"><img id="w" src="./img/rotonde.svg"></a><p><a href="./josh.html">Josh Avanier</a> © Éternité</footer></div><script src="./search.js"></script></body></html>`;
  }
}
