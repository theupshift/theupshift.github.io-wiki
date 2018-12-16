const fs = require('fs');
const Indental = require('./build/lib/indental');
const Runic = require('./build/lib/runic');
const lex = './database/lexicon.tome';

const Builder = require('./build/builder');
const Manager = require('./build/manager');

let database = {};

String.prototype.toCapitalCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.prototype.toUrl = function () {
  return this.replace(/ /g, '_').replace(/\W/g, '').trim().toLowerCase();
}

fs.readFile(lex, 'utf-8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  } else {
    const manager = new Manager(new Indental(data).parse());
    const builder = new Builder(manager.pages);

    console.time('Build time');
    builder.build();
    console.timeEnd('Build time');
    console.log('The Athenaeum is ready')
  }
});
