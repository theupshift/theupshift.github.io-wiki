const Runic = require('../lib/runic');
const LogSet = require('../lib/set.js');

module.exports = function Status ({term, unde, type, line}, tables, logs) {
  this.id = term.toLowerCase();
  this.parent = 'home';
  this.filename = this.id.toUrl();
  this.path = `./wiki/${this.filename}.html`;

  const set = new LogSet(logs.raw);

  function _template (acc, term) {
    return `${Array.isArray(line[term]) ? new Runic(line[term]).parse() : line[term]}`;
  }

  function _core (id, parent, content) {
    return `${Object.keys(line).reduce(_template, '')}`.trim()
  }

  function _summary () {
    let html = `
      <h2>Time-Tracker</h2>
      <div class="r">
      <ul class="stats">
        <li>
          <p>${set.lh.toFixed(2)}</p>
          <span>Logged Hours</span>
        </li>
        <li>
          <p>${set.count}</p>
          <span>Log Entries</span>
        </li>
        <li>
          <p>${set.dailyAvg().toFixed(2)}</p>
          <span>Daily Average</span>
        </li>
        <li>
          <p>${set.coverage().toFixed(2)} %</p>
          <span>Coverage</span>
        </li>
        <li>
          <p>${set.listSectors().length}</p>
          <span>Projects</span>
        </li>
        <li>
          <p>${set.listProjects().length}</p>
          <span>Sectors</span>
        </li>
      </ul>
      </div>
    `;

    return html
  }

  function _undocumented () {
    const pro = set.listProjects();
    const undoc = [];
    const keys = Object.keys(tables);

    for (let i = 0, l = pro.length; i < l; i++) {
      if (keys.indexOf(pro[i].toUpperCase()) < 0) {
        undoc[undoc.length] = pro[i];
      }
    }

    const sort = undoc.sort();
    let html = ''
    for (let i = 0, l = sort.length; i < l; i++) {
      html += `<li>${sort[i]}`;
    }

    const total = pro.length;
    const undocTotal = undoc.length;

    return `<h2>Undocumented</h2>
    <ul class="stats">
      <li>
        <p>${total}</p>
        <span>Total Projects</span>
      </li>
      <li>
        <p>${undocTotal}</p>
        <span>Undocumented</span>
      </li>
      <li>
        <p>${((total - undocTotal) / total * 100).toFixed(2)}%</p>
        <span>Completion</span>
      </li>
    </ul>
    <div class="col"><ul>${html}</ul></div>`;
  }

  function makeIndex (lexicon = database) {
    const {home, index, page, portal, status} = organiseByType(lexicon);
    return makeIndexTable(index)
      + makePortalTable(portal)
      + makePageTable(page);
  }

  function countTypes () {
    const counts = {
      index: 0,
      portal: 0,
      page: 0
    }

    for (let key in tables) {
      counts[tables[key].type]++;
    }

    return counts;
  }

  function makeIndexTable (index) {
    let html = '';
    let warnings = 0;
    let criticals = 0;
    for (let i = 0, l = index.length; i < l; i++) {
      const {term, line, type} = index[i];
      const long = new Runic(line['$']).html();
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const CI = completenessIndex(x, y);
      const indx = calcIndex(CI, 2);

      if (indx > 0.5) continue;

      let klass = '';
      if (indx < 0.5) {
        klass = 'critical';
        criticals++;
      } else {
        klass = 'warning';
        warnings++;
      }

      html += `<tr class="${klass}"><td><a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a></td><td class="ac">${x ? '' : '#'}</td><td class="ac">${y ? '' : '#'}</td><td class="ar">${indx.toFixed(2)}</td></tr>`;
    }

    const indexes = countTypes().index;
    const completion = (indexes - (warnings + criticals)) / indexes * 100;

    return `
    <h2>Indexes</h2>
    <ul class="stats">
      <li><p>${indexes}</p><span>Total</span></li>
      <li><p>${warnings}</p><span>Warnings</span></li>
      <li><p>${criticals}</p><span>Critical</span></li>
      <li><p>${completion.toFixed(2)}%</p><span>Completion</span></li>
    </ul>
    <table><thead><tr><th>Index</th><th class="ac">Info</th><th class="ac">Media</th><th class="ar">Completion</th></tr></thead><tbody>${html}</tbody></table>`;
  }

  function makePortalTable (portal) {
    let html = '';
    let warnings = 0;
    let criticals = 0;
    for (let i = 0, l = portal.length; i < l; i++) {
      const {term, line, type} = portal[i];
      const long = new Runic(line['$']).html();
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const CI = completenessIndex(x, y);
      const indx = calcIndex(CI, 2);

      if (indx > 0.5) continue;

      let klass = '';
      if (indx < 0.5) {
        klass = 'critical';
        criticals++;
      } else if (indx < 1) {
        klass = 'warning';
        warnings++;
      }

      html += `<tr class="${klass}"><td><a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a></td><td class="ac">${x ? '' : '#'}</td><td class="ac">${y ? '' : '#'}</td><td class="ar">${indx.toFixed(2)}</td></tr>`;
    }

    const portals = countTypes().portal;
    const completion = (portals - (warnings + criticals)) / portals * 100;

    return `<h2>Portals</h2>
    <ul class="stats">
      <li><p>${portals}</p><span>Total</span></li>
      <li><p>${warnings}</p><span>Warnings</span></li>
      <li><p>${criticals}</p><span>Critical</span></li>
      <li><p>${completion.toFixed(2)}%</p><span>Completion</span></li>
    </ul><table><thead><tr><th>Portal</th><th class="ac">Info</th><th class="ac">Media</th><th class="ar">Completion</th></tr></thead><tbody>${html}</tbody></table>`;
  }

  function makePageTable (page) {
    let html = '';
    let warnings = 0;
    let criticals = 0;
    for (let i = 0, l = page.length; i < l; i++) {
      const {term, line, type} = page[i];
      const long = new Runic(line['$']).html();
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const z = long.indexOf('<a') > -1;
      const CI = completenessIndex(x, y, z);
      const indx = calcIndex(CI, 3);

      if (indx > 0.7) continue;

      let klass = '';
      if (indx < 0.5) {
        klass = 'critical';
        criticals++;
      } else if (indx < 1) {
        klass = 'warning';
        warnings++;
      }

      html += `<tr class="${klass}"><td><a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a></td><td class="ac">${x ? '' : '#'}</td><td class="ac">${y ? '' : '#'}</td><td class="ac">${z ? '' : '#'}</td><td class="ar">${indx.toFixed(2)}</td></tr>`;
    }

    const pages = countTypes().page;
    const completion = (pages - (warnings + criticals)) / pages * 100;

    return `<h2>Pages</h2>
    <ul class="stats">
      <li><p>${pages}</p><span>Total</span></li>
      <li><p>${warnings}</p><span>Warnings</span></li>
      <li><p>${criticals}</p><span>Critical</span></li>
      <li><p>${completion.toFixed(2)}%</p><span>Completion</span></li>
    </ul><table><thead><tr><th>Page</th><th class="ac">Info</th><th class="ac">Media</th><th class="ac">Links</th><th class="ar">Completion</th></tr></thead><tbody>${html}</tbody></table>`;
  }

  function makeTableHeader () {
    return `<table><thead><tr><th>Page</th><th class="ac">IN</th><th class="ac">MD</th><th class="ac">LN</th><th class="ar">CI</th></tr></thead><tbody>`;
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
    for (let i = 0, l = points.length; i < l; i++) {
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
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="author" content="Josh Avanier"><title>${id.toCapitalCase()}</title><link rel="stylesheet" href="../s.css"/></head><body><div id="v"><p id="u"><a href="../index.html">Home</a></p><input id="s" value="${id.toCapitalCase()}" spellcheck="false"><main id="c">${_core(id, parent)}${_summary()}${makeIndex()}${_undocumented()}</main><footer id="f"><a href="http://webring.xxiivv.com/#random" target="_blank"><img id="w" src="./img/rotonde.svg"></a><p><a href="./josh.html">Josh Avanier</a> © Éternité</footer></div><script src="./search.js"></script></body></html>`;
  }
}
