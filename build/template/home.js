const Template = require('./template');
const Utils = require('../lib/utils');

module.exports = function ({term, type, line}) {
  Template.call(this, {term, type, line});
  this.parent = 'home';
  this.filename = 'index';
  this.path = `./${this.filename}.html`;

  /**
   * Get term children
   * @param {string} n
   * @param {Object=} db
   * @return {Array} Children
   */
  function _getChildren (n, db = database) {
    let scion = [];
    for (let id in db) {
      const term = db[id];
      if (!term.unde || n !== term.unde.toUpperCase()) continue;
      scion[scion.length] = term;
    }
    return scion;
  }

  /**
   * Create link
   * @param {string} t - Term
   * @return {string} Link
   */
  function _link (t) {
    return `<a href="./wiki/${t.toUrl()}.html">${t.toCap()}</a>`;
  }

  /**
   * Insert item into Home Index
   * @param {string} x - Term
   * @param {string} y - Bref
   * @return {string} Item
   */
  function _row (x, y) {
    return `<tr><td>${x}<td>${y}`;
  }

  /**
   * Build Home Index
   * @param {string} name - Term
   * @return {string} Index
   */
  function _index (name) {
    const n = name.toUpperCase();
    const scion = _getChildren(n);
    const l = scion.length;
    let html = '';

    for (let i = 0; i < l; i++) {
      const {term, line} = scion[i];
      if (term !== n) html += _row(_link(term), line['?']);
    }

    return l > 0 ? `<div id="i"><table>${html}</table></div>` : '';
  }

  /**
   * Render Home page
   * @return {string} Content
   */
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
