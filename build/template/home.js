const Template = require('./template');
const Utils = require('../lib/utils');

module.exports = function ({term, type, line}) {
  Template.call(this, {term, type, line});
  this.parent = 'home';
  this.filename = 'index';
  this.path = `./${this.filename}.html`;

  function _getChildren (n, db = database) {
    let scion = [];
    for (let id in db) {
      const term = db[id];
      if (!term.unde || n !== term.unde.toUpperCase()) continue;
      scion[scion.length] = term;
    }
    return scion;
  }

  function _link (t) {
    return `<a href="./wiki/${t.toUrl()}.html">${t.toCapitalCase()}</a>`;
  }

  function _index (name) {
    const n = name.toUpperCase();
    const scion = _getChildren(n);
    const l = scion.length;
    let html = '';

    const _row = (x, y) =>`<tr><td>${x}<td>${y}`;

    for (let i = 0; i < l; i++) {
      const {term, line} = scion[i];
      if (term !== n) html += _row(_link(term), line['?']);
    }

    return l > 0 ? `<div id="i"><table>${html}</table></div>` : '';
  }

  this.render = () => {
    return Utils.merge([
      this.head(false),
      '<body>',
      this.header(false),
      '<div id="c">',
      this.core(),
      _index(this.id),
      '</div>',
      this.footer(false),
      this.search(false)
    ]);
  }
}
