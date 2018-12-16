const Runic = require('../lib/runic');

module.exports = function Index ({term, unde, type, line}) {
  this.id = term.toLowerCase();
  this.parent = unde || 'home';
  this.filename = type === 'home' ? 'index' : this.id.toUrl();
  this.path = `./joshavanier.github.io/${this.filename}.html`;

  function _template (acc, term) {
    return `${Array.isArray(line[term]) ? new Runic(line[term]).parse() : line[term]}`;
  }

  function _core (id, parent, content) {
    return `${Object.keys(line).reduce(_template, '')}`.trim()
  }

  function makeIndex (name, lexicon = database, stop = false) {
    let html = '';
    let children = [];
    const n = name.toUpperCase();

    for (let id in lexicon) {
      const term = lexicon[id];
      if (!term.unde || n !== term.unde.toUpperCase()) continue;
      children[children.length] = term;
    }

    for (let id in children) {
      const child = children[id];
      const {term, line} = child;
      const link = `<a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a>`
      html += `<dt>${link}</dt><dd>${child.line['?']}</dd>`;
    }

    return children.length > 0 ? `<dl>${html}</dl>` : '';
  }

  this.render = () => {
    const {id, parent} = this;
    const parentURL = parent === 'Home' ? 'index' : parent.toUrl();
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="author" content="Josh Avanier"><title>${id.toCapitalCase()}</title><link rel="stylesheet" href="./s.css"/></head><body><div id="v"><p id="u"><a href="./${parentURL}.html">${parent.toCapitalCase()}</a></p><input id="s" value="${id.toCapitalCase()}" spellcheck="false"><main id="c">${_core(id, parent)}${makeIndex(id)}</main><footer id="f"><a href="http://webring.xxiivv.com/#random" target="_blank"><img id="w" src="./img/rotonde.svg"></a><p><a href="./josh.html">Josh Avanier</a> © Éternité</footer></div><script src="./search.js"></script></body></html>`;
  }
}
