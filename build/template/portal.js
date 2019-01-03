const Template = require('./template');

module.exports = function ({term, unde, type, line}) {
  Template.call(this, {term, unde, type, line});
  this.path = `./wiki/${this.filename}.html`;

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
   * Insert item to Portal index
   * @param {string} t - Term
   * @param {string} y - Description
   * @return {string} Item
   */
  function _ins (t, y) {
    const url = t.toUrl();
    return `<p><a href="./${url}.html">${t.toCap()}</a><br>${y}`;
  }

  /**
   * Build Portal index
   * @param {string} t - Term
   * @return {string} Index
   */
  function _index (t) {
    const n = t.toUpperCase();
    const c = _getChildren(n);
    const i = c.reduce((v, {term, line}) => v += _ins(term, line['?']), '');
    return c.length > 0 ? `<div id="i">${i}</div>` : '';
  }

  /**
   * Render Portal page
   * @return {string} Content
   */
  this.render = () => {
    return [
      this.head(),
      '<body>',
      this.header(),
      `<div id="c">${this.core()}`,
      `${_index(this.id)}</div>`,
      this.footer(),
      this.search()
    ].join('');
  }
}
