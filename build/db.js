const fs = require('fs');
module.exports = function (tables) {
  this.store = {};
  for (let id in tables) {
    const file = tables[id];
    this.store[file] = fs.readFileSync(
      `./db/${file}.tome`, 'utf8'
    );
  }
}
