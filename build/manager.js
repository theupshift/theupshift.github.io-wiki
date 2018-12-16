const Page = require('./template/page');
const Index = require('./template/index');
const Status = require('./template/status');
const LogSet = require('./lib/set.js');

module.exports = function Manager (tables, logs) {
  this.pages = {};
  database = tables;

  for (let id in tables) {
    const page = tables[id];
    switch (page.type) {
      case 'index':
      case 'portal':
      case 'home':
        this.pages[id] = new Index(page);
        break;
      case 'status':
        this.pages[id] = new Status(page);
        break;
      default:
        if (id in logs.data.pro) console.log(id)
        const data = new LogSet(id in logs.data.pro ? logs.data.pro[id] : []);
        this.pages[id] = new Page(page, data);
        break;
    }
  }
}
