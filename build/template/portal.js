const Template = require('./template');

module.exports = function ({term, root, line}) {
  Template.call(this, {term, root, line});
  this.path = `./wiki/${this.file}.html`;

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
      if (!term.root || n !== term.root) continue;
      scion[scion.length] = term;
    }
    return scion;
  }

  /**
   * Insert index item
   * @param {string} t - Term
   * @param {string} d - Description
   * @return {string} Item
   */
  function _ins (t, d) {
    return `<a href="${t.toUrl()}.html">${t.toCap()}</a><br>`;
  }

  /**
   * Build index
   * @param {string} t - Term
   * @return {string} Index
   */
  function _index (t) {
    const c = _getChildren(t);
    const i = c.reduce((v, {term, line}) => v += _ins(term, line['?']), '');
    return c.length > 0 ? `<p class="x">${i}` : '';
  }

  /**
   * Render Portal page
   * @return {string} Content
   */
  this.render = () => {
    return [
      this.head(), this.header(),
      `<main>${this.core()}${_index(this.id)}</main>`,
      this.footer(), this.search()
    ].join('');
  }
}
