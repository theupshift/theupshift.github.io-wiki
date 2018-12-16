const fs = require('fs');
const indental = require('./lib/indental');

module.exports = function Database (tables) {
  this.storage = {};

  for (const id in tables) {
    const table = tables[id];
    const path = `./database/${table}.tome`;
    const content = fs.readFileSync(path, 'utf8');
    this.storage[table] = content;
  }
}
