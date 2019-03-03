const Runic = require('../lib/runic');
const LogSet = require('../lib/set');
const Template = require('./template');

module.exports = function ({term, root, type, line}, logs, tables) {
  Template.call(this, {term, root, type, line});
  this.path = `./wiki/${this.file}.html`;
  const set = new LogSet(logs.raw);

  /**
   * Mark
   * @param {boolean} x
   * @return {string} Mark
   */
  const _mark = x => x ? '＋' : '－';

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

    const sorted = Object.keys(portals).sort((a, b) => {
      return (portals[a].term > portals[b].term) ? 1 : -1;
    });

    for (let i = 0, l = sorted.length; i < l; i++) {
      const {term, line} = portals[sorted[i]];
      const long = new Runic(line).html();
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const CI = _calcCI(x, y);
      const indx = _calcIndex(CI, 2);

      if (indx > 0.5) continue;
      todo++;

      html += `${_mark(x)}${_mark(y)} <a href="./${term.toUrl()}.html">${term.toCap()}</a><br>`;
    }

    const total = _countTypes().portal;
    const fini = (total - todo) / total * 100;

    return [
      '<h2>Portals</h2><p class="x">',
      `${total} Σ<br>`,
      `${todo} unfini<br>`,
      `${fini.toFixed(0)}% fini`,
      '<p>Key: info, media',
      `<p class="x">${html}`
    ].join('');
  }

  /**
   * Build Page table
   * @param {Array} pages
   * @return {string} Table
   */
  function _pageTable (pages) {
    let html = '', todo = 0;

    const sorted = Object.keys(pages).sort((a, b) => {
      return (pages[a].term > pages[b].term) ? 1 : -1;
    });

    for (let i = 0, l = sorted.length; i < l; i++) {
      const {term, line} = pages[sorted[i]];
      const long = new Runic(line).html();
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const z = long.indexOf('<a') > -1;
      const CI = _calcCI(x, y, z);
      const indx = _calcIndex(CI, 3);

      if (indx > 0.7) continue;
      todo++;

      html += `${_mark(x)}${_mark(y)}${_mark(z)} <a href="./${term.toUrl()}.html">${term.toCap()}</a><br>`;
    }

    const total = _countTypes().page;
    const fini = (total - todo) / total * 100;

    return [
      '<h2>Pages</h2><p class="x">',
      `${total} Σ<br>`,
      `${todo} unfini<br>`,
      `${fini.toFixed(0)}% fini`,
      '<p>Key: info, media, links',
      `<p class="x">${html}`
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
  function _undoc (s = set) {
    const keys = Object.keys(tables);
    const pro = s.listProjects();
    const undoc = [];

    for (let i = 0, l = pro.length; i < l; i++) {
      if (keys.indexOf(pro[i].toUpperCase()) < 0) {
        undoc[undoc.length] = pro[i];
      }
    }

    const total = pro.length;
    const undocTotal = undoc.length;
    const perc = (total - undocTotal) / total * 100;

    return [
      `<p class="x">${total} projects<br>`,
      `${undocTotal} missing<br>`,
      `${perc.toFixed(0)}% fini`
    ].join('');
  }

  /**
   * Render Status page
   * @return {string} Content
   */
  this.render = () => {
    return [
      this.head(), this.header(),
      `<main>${this.core()}`,
      `${_undoc()}${_makeTables(organiseByType())}`,
      '</main>', this.footer(), this.search()
    ].join('');
  }
}
