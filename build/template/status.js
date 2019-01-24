const Runic = require('../lib/runic');
const LogSet = require('../lib/set');
const Template = require('./template');

module.exports = function ({term, unde, type, line}, tables, logs) {
  Template.call(this, {term, unde, type, line});
  this.path = `./wiki/${this.filename}.html`;

  const set = new LogSet(logs.raw);

  /**
   * Mark
   * @param {boolean} x
   * @return {string} Mark
   */
  function _mark (x) {
    return x ? '＋' : '－';
  }

  /**
   * Calculate Completion Index
   * @param {Array} p
   * @return {number} Completion Index
   */
  function _calcCI (...p) {
    return p.reduce((i, v) => i += (v ? 1 : 0), 0);
  }

  /**
   * Calculate Index
   * @param {number} CI
   * @param {number} maxPoints
   * @return {number} Index
   */
  function _calcIndex (CI, maxPoints) {
    return CI === 0 ? 0 : CI / maxPoints;
  }

  /**
   * Organise database by page type
   * @param {Object=} db - Database
   * @return {Object} Organised database
   */
  function organiseByType (db = database) {
    const types = {};
    for (let key in db) {
      const {type, name} = db[key];
      types[type] === undefined && (types[type] = []);
      types[type][types[type].length] = db[key];
    }
    return types;
  }

  /**
   * Build log summary
   * @return {string} Summary
   */
  function _summary () {
    return [
      '<ul class="x">',
      `<li><b>${set.lh.toFixed(2)}</b> hours`,
      `<li><b>${set.count}</b> logs`,
      `<li><b>${set.dailyAvg().toFixed(2)}</b> daily avg`,
      _undocumented(),
      '</ul>'
    ].join('');
  }

  /**
   * Count page types
   * @return {Object} Counts
   */
  function _countTypes () {
    const counts = {portal: 0, note: 0, page: 0}
    for (let key in tables) counts[tables[key].type]++;
    return counts;
  }

  /**
   * Build Portal table
   * @param {Array} portals
   * @return {string} Table
   */
  function _portalTable (portals) {
    let html = '', todo = 0;
    for (let i = 0, l = portals.length; i < l; i++) {
      const {term, line} = portals[i];
      const long = new Runic(line['$']).html();
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const CI = _calcCI(x, y);
      const indx = _calcIndex(CI, 2);

      if (indx > 0.5) continue;
      todo++;

      html += `<li>${_mark(x)}${_mark(y)} <a href="./${term.toUrl()}.html">${term.toCap()}</a></li>`;
    }

    const total = _countTypes().portal;
    const completion = (total - todo) / total * 100;

    return [
      '<h2>Portals</h2><ul class="x">',
      `<li><b>${total}</b> Σ`,
      `<li><b>${todo}</b> unfini`,
      `<li><b>${completion.toFixed(2)}%</b> fini`,
      '</ul><p><b>Key:</b> info, media',
      `<ul class="x">${html}</ul>`
    ].join('');
  }

  /**
   * Build Page table
   * @param {Array} page
   * @return {string} Table
   */
  function _pageTable (page) {
    let html = '', todo = 0;
    for (let i = 0, l = page.length; i < l; i++) {
      const {term, line} = page[i];
      const long = new Runic(line['$']).html();
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const z = long.indexOf('<a') > -1;
      const CI = _calcCI(x, y, z);
      const indx = _calcIndex(CI, 3);

      if (indx > 0.7) continue;
      todo++;

      html += `<li>${_mark(x)}${_mark(y)}${_mark(z)} <a href="./${term.toUrl()}.html">${term.toCap()}</a></li>`;
    }

    const pages = _countTypes().page;
    const completion = (pages - todo) / pages * 100;

    return [
      '<h2>Pages</h2><ul class="x">',
      `<li><b>${pages}</b> Σ`,
      `<li><b>${todo}</b> unfini`,
      `<li><b>${completion.toFixed(2)}%</b> fini`,
      '</ul><p><b>Key:</b> info, media, links',
      `</ul><ul class="x">${html}</ul>`
    ].join('');
  }

  /**
   * Build tables
   * @param {Object} p - Page types
   * @param {Array} p.portal - Portals
   * @param {Array} p.page - Pages
   */
  function _makeTables ({portal, page}) {
    return _portalTable(portal) + _pageTable(page);
  }

  /**
   * Build Undocumented section
   * @return {string} Undocumented
   */
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

    return [
      `<li><b>${total}</b> projects`,
      `<li><b>${undocTotal}</b> missing`,
      `<li><b>${((total - undocTotal) / total * 100).toFixed(2)}%</b> fini`
    ].join('');
  }

  /**
   * Render Status page
   * @return {string} Content
   */
  this.render = () => {
    return [
      this.head(),
      this.header(),
      `<main>${this.core()}`,
      `${_summary()}${_makeTables(organiseByType())}`,
      '</main>',
      this.footer(),
      this.search()
    ].join('');
  }
}
