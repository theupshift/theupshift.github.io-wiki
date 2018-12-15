const Runic = require('../lib/runic');

module.exports = function IndexPage ({term, unde, type, line}) {
  this.id = term.toLowerCase();
  this.parent = unde || 'home';
  this.filename = this.id.toUrl();
  this.path = `./docs/${this.filename}.html`;

  function _template (acc, term) {
    return `${Array.isArray(line[term]) ? new Runic(line[term]).parse() : line[term]}`;
  }

  function _core (id, parent, content) {
    return `${Object.keys(line).reduce(_template, '')}`.trim()
  }

  function makeIndex (name, lexicon = database, stop = false) {
    let html = '';
    let children = [];

    for (let id in lexicon) {
      const term = lexicon[id];
      if (!term.unde || name.toUpperCase() !== term.unde.toUpperCase()) continue;
      children[children.length] = term;
    }

    for (let id in children) {
      const child = children[id];
      const {term, line} = child;
      console.log(child)
      const link = `<a href="./${term.toUrl()}.html">${term.toCapitalCase()}</a>`
      html += `<dt>${link}</dt><dd>${child.line['?']}</dd>`;
    }

    return children.length > 0 ? `<dl>${html}</dl>` : '';
  }

  this.render = () => {
    const {id, parent} = this;
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="author" content="Josh Avanier"><title>${id.toCapitalCase()}</title><link rel="stylesheet" href="../s.css"/></head><body><div id="v"><p id="u"><a href="./${parent.toUrl()}.html">${parent.toCapitalCase()}</a><input id="s" value="${id.toCapitalCase()}" spellcheck="false"><main id="c">${_core(id, parent)}${makeIndex(id)}</main><footer id="f"><a href="http://webring.xxiivv.com/#random" target="_blank"><img id="w" src="../img/rotonde.svg"></a><p><a href="./josh.html">Josh Avanier</a> © Éternité</footer></div><script src="../search.js"></script></body></html>`;
  }
}
