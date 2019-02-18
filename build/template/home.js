const Template = require('./template');

module.exports = function ({term, type, line}) {
  Template.call(this, {term, type, line});
  Object.assign(this, {
    root: 'HOME',
    file: 'index',
    path: './wiki/index.html'
  });

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
   * Insert item into Home Index
   * @param {string} t - Term
   * @param {string} b - Bref
   * @return {string} Item
   */
  function _row (t, b) {
    return `<a href="${t.toUrl()}.html">${t.toCap()}</a><br>`;
  }

  /**
   * Build Home Index
   * @param {string} name - Term
   * @return {string} Index
   */
  function _index (name) {
    const scion = _getChildren(name);
    const l = scion.length;
    let html = '';

    for (let i = 0; i < l; i++) {
      const {term, line} = scion[i];
      term !== name && (html += _row(term, line['?']));
    }

    return l > 0 ? `<p class="x">${html}` : '';
  }

  /**
   * Build footer
   * @return {string} Footer
   */
  this.footer = () => {
    return [
      '<a href="copyright.html">&copy; ',
      `2017&ndash;${new Date().getFullYear()}</a><br>`,
      '<a href="https://webring.xxiivv.com/#random">Webring</a>'
    ].join('');
  }

  /**
   * Render Home page
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
