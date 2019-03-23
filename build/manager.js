const Page = require('./template/page')
const Home = require('./template/home')
const Portal = require('./template/portal')
const Status = require('./template/status')
const LogSet = require('./lib/set')
module.exports = function (tables, logs) {
  this.pages = {}
  database = tables

  /**
   * Create a Home page
   * @param {Object} p - Page
   * @return {Object} Page
   */
  const _home = p => new Home(p, tables)

  /**
   * Create a Status page
   * @param {Object} p - Page
   * @return {Object} Page
   */
  const _status = p => new Status(p, logs, tables)

  /**
   * Create a standard page
   * @param {Object} p - Page
   * @return {Object} Page
   */
  function _standard (p, {data: {pro}} = logs) {
    const {term} = p
    return new Page(p, new LogSet(term in pro ? pro[term] : []), tables)
  }

  /**
   * Render Page
   * @param {Object} p
   * @return {Object} Page
   */
  function _render (p) {
    switch (p.type) {
      case 'home': return _home(p)
      case 'portal': return new Portal(p)
      case 'status': return _status(p)
      default: return _standard(p)
    }
  }

  for (let id in tables) this.pages[id] = _render(tables[id])
}
