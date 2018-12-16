const Page = require('./template/page');
const Index = require('./template/index');
const Status = require('./template/status');

module.exports = function Manager (tables) {
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
        this.pages[id] = new Page(page);
        break;
    }
  }
}
