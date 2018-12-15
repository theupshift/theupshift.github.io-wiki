const Page = require('./template/page');
const Index = require('./template/index');
const Status = require('./template/status');

module.exports = function Manager (tables) {
  this.pages = {};
  database = tables;

  for (let id in tables) {
    const page = tables[id];
    console.log(page.type)
    if (page.type === 'index' || page.type === 'portal' || page.type === 'home') {
      this.pages[id] = new Index(page);
    } else if (page.type === 'status') {
      this.pages[id] = new Status(page);
    } else {
      this.pages[id] = new Page(page);
    }
  }
}
