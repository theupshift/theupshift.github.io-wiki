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
   * @param {string} d - Description
   * @return {string} Item
   */
  function _ins (t, d) {
    const url = t.toUrl();
    return `<li><a href="./${url}.html">${t.toCap()}</a>`;
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
    return c.length > 0 ? `<ul class="c3">${i}</ul>` : '';
  }

  /**
   * Render Portal page
   * @return {string} Content
   */
  this.render = () => {
    return [
      this.head(),
      this.header(),
      `<div id="c">${this.core()}`,
      `${_index(this.id)}</div>`,
      this.footer(),
      this.search()
    ].join('');
  }
}
