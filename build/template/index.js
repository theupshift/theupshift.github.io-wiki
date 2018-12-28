const Template = require('./template');
const Utils = require('../lib/utils');

module.exports = function ({term, unde, type, line}) {
  Template.call(this, {term, unde, type, line});
  this.path = `./wiki/${this.filename}.html`;

  const _lnk = t => `<a href="./${t.toUrl()}.html">${t.toCapitalCase()}</a>`;
  const _row = (x, y) => `<tr><td>${x}</td><td>${y}</td></tr>`;

  function _getChildren (n, db = database) {
    let scion = [];
    for (let id in db) {
      const term = db[id];
      if (!term.unde || n !== term.unde.toUpperCase()) continue;
      scion[scion.length] = term;
    }
    return scion;
  }

  function _index (name) {
    const n = name.toUpperCase();
    const scion = _getChildren(n);
    const html = scion.reduce((c, {term, line}) => {
      return c += _row(_lnk(term), line['?']);
    }, '');

    return scion.length > 0 ? `<div id="i"><table>${html}</table></div>` : '';
  }

  this.render = () => {
    return Utils.merge([
      this.head(),
      '<body>',
      this.header(),
      '<div id="c">',
      this.core(),
      _index(this.id),
      '</div>',
      this.footer(),
      this.search()
    ]);
  }
}
