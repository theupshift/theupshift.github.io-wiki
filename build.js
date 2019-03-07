const Indental = require('./build/lib/indental');
const Builder = require('./build/builder');
const Manager = require('./build/manager');
const Database = require('./build/db');
const Lexicon = require('./build/lexicon');
const Log = require('./build/log');

const home = require('os').homedir();
const logs = new Log(`${home}/log.json`);
const db = new Database([
  'lexicon', 'oeuvre', 'commonplace', 'dictionary'
]);

String.prototype.toCap = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.prototype.toUrl = function () {
  return this.replace(/ /g, '_').replace(/\W/g, '').trim().toLowerCase();
}

let data = '';
for (let key in db.store) data += db.store[key];

const {pages} = new Manager(new Indental(data).parse(), logs);

new Builder(pages).build();
new Lexicon(pages).build();
