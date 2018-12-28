const fs = require('fs');
module.exports = function (tables) {
  this.storage = {};
  for (let id in tables) {
    const file = tables[id];
    const path = `./database/${file}.tome`;
    const data = fs.readFileSync(path, 'utf8');
    this.storage[file] = data;
  }
}
