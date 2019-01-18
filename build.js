const Indental = require('./build/lib/indental');
const Builder = require('./build/builder');
const Manager = require('./build/manager');
const Database = require('./build/db');
const Lexicon = require('./build/lexicon');
const Log = require('./build/log');

const home = require('os').homedir();
const indexes = ['lexicon', 'oeuvre', 'monographs', 'commonplace'];
const db = new Database(indexes);
const logs = new Log(`${home}/log.json`);

String.prototype.toCap = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.prototype.toUrl = function () {
  return this.replace(/ /g, '_').replace(/\W/g, '').trim().toLowerCase();
}

let data = '';
for (let key in db.storage) {
  data += db.storage[key]
}

const {pages} = new Manager(new Indental(data).parse(), logs);

console.time('Build time');
new Builder(pages).build();
new Lexicon(pages).build();
console.timeEnd('Build time');
