const Page = require('./template/page');
const Home = require('./template/home');
const Portal = require('./template/portal');
const Status = require('./template/status');
const LogSet = require('./lib/set');

module.exports = function (tables, logs) {
  this.pages = {};
  database = tables;

  /**
   * Create a Page
   * @param {Object} page
   * @return {Object} Page
   */
  function _createPage (page) {
    switch (page.type) {
      case 'home': return new Home(page);
      case 'portal': return new Portal(page);
      case 'status': return new Status(page, tables, logs);
      default: {
        const id = page.term;
        const data = new LogSet(
          id in logs.data.pro ? logs.data.pro[id] : []
        );
        return new Page(page, data);
      }
    }
  }

  for (let id in tables) {
    this.pages[id] = _createPage(tables[id]);
  }
}
