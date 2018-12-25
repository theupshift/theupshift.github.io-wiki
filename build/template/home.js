const Runic = require('../lib/runic');
const Template = require('./template');

module.exports = function ({term, unde, type, line}) {
  Template.call(this, {term, unde, type, line});
  this.parent = 'home';
  this.filename = 'index';
  this.path = `./${this.filename}.html`;

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
      if (child.term === 'HOME') continue;
      const {term, line} = child;
      const link = `<a href="./wiki/${term.toUrl()}.html">${term.toCapitalCase()}</a>`
      html += `<tr><td>${link}<td>${child.line['?']}`;
    }

    return children.length > 0 ? `<div id="i"><table><tbody>${html}</table></div>` : '';
  }

  this.render = () => {
    const {id, parent} = this;
    return `${this.head()}<body>${this.header()}<div id="c"><p>${this.core(id, parent)}</p>${makeIndex(id)}</div>${this.footer()}<script src="./search.js"></script>`;
  }
}
