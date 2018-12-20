const fs = require('fs');

module.exports = function (tables) {
  this.storage = {};

  for (const id in tables) {
    const table = tables[id];
    const path = `./database/${table}.tome`;
    const content = fs.readFileSync(path, 'utf8');
    this.storage[table] = content;
  }
}
