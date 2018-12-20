const Runic = require('../lib/runic');
const Template = require('./template');

module.exports = function ({term, unde, type, line}) {
  Template.call(this, {term, unde, type, line});
  this.path = `./wiki/${this.filename}.html`;

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
      html += `<tr><td>${link}</td><td>${child.line['?']}</td></tr>`;
    }

    return children.length > 0 ? `<div id="i"><table><tbody>${html}</tbody></table></div>` : '';
  }

  this.render = () => {
    const {id, parent} = this;
    return `${this.head()}<body><div id="v">${this.header()}<main id="c"><p>${this.core(id, parent)}</p>${makeIndex(id)}</main>${this.footer()}</div><script src="../search.js"></script></body></html>`;
  }
}
