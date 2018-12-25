const Runic = require('../lib/runic');
const LogSet = require('../lib/set.js');
const Template = require('./template');

module.exports = function ({term, unde, type, line}, tables, logs) {
  Template.call(this, {term, unde, type, line});
  this.path = `./wiki/${this.filename}.html`;

  const set = new LogSet(logs.raw);

  function _summary () {
    return `<h2>Time-Tracker</h2><div class="r"><ul class="stats"><li><p>${set.lh.toFixed(2)}</p><span>Logged Hours</span><li><p>${set.count}</p><span>Log Entries</span><li><p>${set.dailyAvg().toFixed(2)}</p><span>Daily Average</span><li><p>${set.coverage().toFixed(2)} %</p><span>Coverage</span><li><p>${set.listSectors().length}</p><span>Projects</span><li><p>${set.listProjects().length}</p><span>Sectors</span></ul></div>`;
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

    return `<h2>Undocumented</h2><ul class="stats"><li><p>${total}</p><span>Total Projects</span><li><p>${undocTotal}</p><span>Undocumented</span><li><p>${((total - undocTotal) / total * 100).toFixed(2)}%</p><span>Completion</span></ul><div class="col"><ul>${html}</ul></div>`;
  }

  function makeIndex (lexicon = database) {
    const {home, index, page, portal, status} = organiseByType(lexicon);
    return makeIndexTable(index)
      + makePortalTable(portal)
      + makePageTable(page);
  }

  function countTypes () {
    const counts = {index: 0, portal: 0, page: 0}

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

      html += `<tr class="${klass}"><td><a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a><td class="ac">${x ? '' : '#'}<td class="ac">${y ? '' : '#'}`;
    }

    const indexes = countTypes().index;
    const completion = (indexes - (warnings + criticals)) / indexes * 100;

    return `<h2>Indexes</h2><ul class="stats"><li><p>${indexes}</p><span>Total</span><li><p>${warnings}</p><span>Warnings</span><li><p>${criticals}</p><span>Critical</span><li><p>${completion.toFixed(2)}%</p><span>Completion</span></ul><table><thead><tr><th>Index<th class="ac">Info<th class="ac">Media<tbody>${html}</table>`;
  }

  function makePortalTable (portal) {
    let html = '', warnings = 0, criticals = 0;
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

      html += `<tr class="${klass}"><td><a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a><td class="ac">${x ? '' : '#'}<td class="ac">${y ? '' : '#'}`;
    }

    const portals = countTypes().portal;
    const completion = (portals - (warnings + criticals)) / portals * 100;

    return `<h2>Portals</h2><ul class="stats"><li><p>${portals}</p><span>Total</span><li><p>${warnings}</p><span>Warnings</span><li><p>${criticals}</p><span>Critical</span><li><p>${completion.toFixed(2)}%</p><span>Completion</span></ul><table><thead><tr><th>Portal<th class="ac">Info<th class="ac">Media<tbody>${html}</table>`;
  }

  function makePageTable (page) {
    let html = '', warnings = 0, criticals = 0;
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

      html += `<tr class="${klass}"><td><a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a><td class="ac">${x ? '' : '#'}<td class="ac">${y ? '' : '#'}<td class="ac">${z ? '' : '#'}`;
    }

    const pages = countTypes().page;
    const completion = (pages - (warnings + criticals)) / pages * 100;

    return `<h2>Pages</h2><ul class="stats"><li><p>${pages}</p><span>Total</span><li><p>${warnings}</p><span>Warnings</span><li><p>${criticals}</p><span>Critical</span><li><p>${completion.toFixed(2)}%</p><span>Completion</span></ul><table><thead><tr><th>Page<th class="ac">Info<th class="ac">Media<th class="ac">Links<tbody>${html}</table>`;
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
    return `${this.head()}<body>${this.header()}<div id="c">${this.core(id, parent)}${_summary()}${makeIndex()}${_undocumented()}</div>${this.footer()}<script src="../search.js"></script>`;
  }
}
