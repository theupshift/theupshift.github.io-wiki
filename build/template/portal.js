const Template = require('./template');

module.exports = function ({term, root, type, line}) {
  Template.call(this, {term, root, type, line});
  this.path = `./wiki/${this.file}.html`;

  /**
   * Get term children
   * @param {string} n
   * @param {Object=} db
   * @return {Array} Children
   */
  function _getChildren (n, db = database) {
    let scion = [], temp = [];
    for (let id in db) {
      const term = db[id];
      if (!term.root || n !== term.root) continue;
      temp[temp.length] = term;
    }

    const sorted = Object.keys(temp).sort((a, b) => {
      return (temp[a].term > temp[b].term) ? 1 : -1;
    });

    for (let i = 0, l = sorted.length; i < l; i++) {
      scion[scion.length] = temp[sorted[i]];
    }

    return scion;
  }

  /**
   * Insert index item
   * @param {string} t - Term
   * @param {boolean} f - Fin
   * @return {string} Item
   */
  function _ins (t, f) {
    return `<a href="${t.toUrl()}.html">${t.toCap()}</a> ${f ? '' : '†'}<br>`;
  }

  /**
   * Build index
   * @param {string} t - Term
   * @return {string} Index
   */
  function _index (t) {
    const c = _getChildren(t);
    const i = c.reduce((v, {term, fin}) => v += _ins(term, fin), '');
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
