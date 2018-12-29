const Runic = require('../lib/runic');
const LogSet = require('../lib/set');
const Utils = require('../lib/utils');
const Template = require('./template');

module.exports = function ({term, unde, type, line}, tables, logs) {
  Template.call(this, {term, unde, type, line});
  this.path = `./wiki/${this.filename}.html`;

  const set = new LogSet(logs.raw);
  const _mark = x => x ? '' : '∅&#xFE0E;';
  const _calcCI = (...p) => p.reduce((i, v) => i += (v ? 1 : 0), 0);
  const _calcIndex = (CI, maxPoints) => CI === 0 ? 0 : CI / maxPoints;

  function organiseByType (db = database) {
    const types = {};
    for (let key in db) {
      const {type, name} = db[key];
      if (types[type] === undefined) types[type] = [];
      types[type][types[type].length] = db[key];
    }
    return types;
  }

  function _summary () {
    return Utils.merge([
      '<h2>Time-Tracker</h2><div class="r"><ul class="stats c3">',
      `<li><p>${set.lh.toFixed(2)}</p><span>Logged Hours</span>`,
      `<li><p>${set.count}</p><span>Log Entries</span>`,
      `<li><p>${set.dailyAvg().toFixed(2)}</p><span>Daily Average</span>`,
      `<li><p>${set.coverage().toFixed(2)}%</p><span>Coverage</span>`,
      `<li><p>${set.listSectors().length}</p><span>Sectors</span>`,
      `<li><p>${set.listProjects().length}</p><span>Projects</span>`,
      '</ul></div>'
    ]);
  }

  function _makeTables ({portal, page}) {
    return _portalTable(portal) + _pageTable(page);
  }

  function _undocumented () {
    const keys = Object.keys(tables);
    const pro = set.listProjects();
    const undoc = [];

    for (let i = 0, l = pro.length; i < l; i++) {
      if (keys.indexOf(pro[i].toUpperCase()) < 0) {
        undoc[undoc.length] = pro[i];
      }
    }

    const total = pro.length;
    const undocTotal = undoc.length;

    return Utils.merge([
      '<h2>Undocumented</h2><ul class="stats c4">',
      `<li><p>${total}</p><span>Total Projects</span>`,
      `<li><p>${undocTotal}</p><span>Undocumented</span>`,
      `<li><p>${((total - undocTotal) / total * 100).toFixed(2)}%</p><span>Completion</span>`,
      '</ul>'
    ]);
  }

  function _countTypes () {
    const counts = {portal: 0, note: 0, page: 0}
    for (let key in tables) counts[tables[key].type]++;
    return counts;
  }

  function _portalTable (index) {
    let html = '', warnings = 0, criticals = 0;
    for (let i = 0, l = index.length; i < l; i++) {
      const {term, line} = index[i];
      const long = new Runic(line['$']).html();
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const CI = _calcCI(x, y);
      const indx = _calcIndex(CI, 2);

      if (indx > 0.5) continue;

      let klass = '';
      if (indx < 0.5) {
        klass = 'critical';
        criticals++;
      } else {
        klass = 'warning';
        warnings++;
      }

      html += `<tr class="${klass}"><td><a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a><td class="ac">${_mark(x)}<td class="ac">${_mark(y)}`;
    }

    const portals = _countTypes().portal;
    const completion = (portals - (warnings + criticals)) / portals * 100;

    return Utils.merge([
      '<h2>Portals</h2><ul class="stats c4">',
      `<li><p>${portals}</p><span>Total</span>`,
      `<li><p>${warnings}</p><span>Warnings</span>`,
      `<li><p>${criticals}</p><span>Critical</span>`,
      `<li><p>${completion.toFixed(2)}%</p><span>Completion</span>`,
      '</ul><table><thead><tr>',
      '<th>Portal<th class="ac">Info<th class="ac">Media',
      `<tbody>${html}</table>`
    ]);
  }

  function _pageTable (page) {
    let html = '', warnings = 0, criticals = 0;
    for (let i = 0, l = page.length; i < l; i++) {
      const {term, line} = page[i];
      const long = new Runic(line['$']).html();
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const z = long.indexOf('<a') > -1;
      const CI = _calcCI(x, y, z);
      const indx = _calcIndex(CI, 3);

      if (indx > 0.7) continue;

      let klass = '';
      if (indx < 0.5) {
        klass = 'critical';
        criticals++;
      } else if (indx < 1) {
        klass = 'warning';
        warnings++;
      }

      html += `<tr class="${klass}"><td><a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a><td class="ac">${_mark(x)}<td class="ac">${_mark(y)}<td class="ac">${_mark(z)}`;
    }

    const pages = _countTypes().page;
    const completion = (pages - (warnings + criticals)) / pages * 100;

    return Utils.merge([
      '<h2>Pages</h2><ul class="stats c4">',
      `<li><p>${pages}</p><span>Total</span>`,
      `<li><p>${warnings}</p><span>Warnings</span>`,
      `<li><p>${criticals}</p><span>Critical</span>`,
      `<li><p>${completion.toFixed(2)}%</p><span>Completion</span>`,
      '</ul><table><thead><tr>',
      '<th>Page<th class="ac">Info<th class="ac">Media<th class="ac">Links',
      `<tbody>${html}</table>`
    ]);
  }

  this.render = () => {
    return Utils.merge([
      this.head(),
      '<body>',
      this.header(),
      '<div id="c">',
      this.core(),
      _summary(),
      _makeTables(organiseByType()),
      _undocumented(),
      '</div>',
      this.footer(),
      this.search()
    ]);
  }
}
