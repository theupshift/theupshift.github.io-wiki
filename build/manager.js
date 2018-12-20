const Page = require('./template/page');
const Home = require('./template/home');
const Index = require('./template/index');
const Status = require('./template/status');
const LogSet = require('./lib/set.js');

module.exports = function (tables, logs) {
  this.pages = {};
  database = tables;

  for (let id in tables) {
    const page = tables[id];
    switch (page.type) {
      case 'home':
        this.pages[id] = new Home(page);
        break;
      case 'index':
      case 'portal':
        this.pages[id] = new Index(page);
        break;
      case 'status':
        this.pages[id] = new Status(page, tables, logs);
        break;
      default:
        const data = new LogSet(id in logs.data.pro ? logs.data.pro[id] : []);
        this.pages[id] = new Page(page, data);
        break;
    }
  }
}
