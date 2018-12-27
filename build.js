const Indental = require('./build/lib/indental');
const Builder = require('./build/builder');
const Manager = require('./build/manager');
const Database = require('./build/database');
const Lexicon = require('./build/lexicon');
const Log = require('./build/log');
const homedir = require('os').homedir();
const indexes = ['lexicon', 'oeuvre', 'monographs', 'commonplace'];
const database = new Database(indexes);
const logs = new Log(`${homedir}/log.json`);

String.prototype.toCapitalCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.prototype.toUrl = function () {
  return this.replace(/ /g, '_').replace(/\W/g, '').trim().toLowerCase();
}

let data = '';
for (let key in database.storage) {
  data += database.storage[key]
}

const manager = new Manager(new Indental(data).parse(), logs);
const builder = new Builder(manager.pages);
const lexicon = new Lexicon(manager.pages);

console.time('Build time');
lexicon.build();
builder.build();
console.timeEnd('Build time');
console.log('The Athenaeum is ready');
