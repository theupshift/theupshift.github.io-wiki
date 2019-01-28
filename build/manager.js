const Page = require('./template/page');
const Home = require('./template/home');
const Portal = require('./template/portal');
const Status = require('./template/status');
const LogSet = require('./lib/set');

module.exports = function (tables, logs) {
  this.pages = {};
  database = tables;

  /**
   * Create a Status page
   * @param {Object} page
   * @param {Object} [t] - Tables
   * @param {Array} [l] - Logs
   * @return {Object} Page
   */
  function _status (page, t = tables, l = logs) {
    return new Status(page, t, l);
  }

  /**
   * Create a standard page
   * @param {Object} p - Page
   * @param {Array} [l] - Logs
   * @return {Object} Page
   */
  function _standard (p, {data: {pro}} = logs) {
    const id = p.term;
    return new Page(p, new LogSet(id in pro ? pro[id] : []));
  }

  /**
   * Render Page
   * @param {Object} p
   * @return {Object} Page
   */
  function _render (p) {
    switch (p.type) {
      case 'home': return new Home(p);
      case 'portal': return new Portal(p);
      case 'status': return _status(p);
      default: return _standard(p);
    }
  }

  for (let id in tables) {
    this.pages[id] = _render(tables[id]);
  }
}
