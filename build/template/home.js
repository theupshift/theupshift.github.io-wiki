const Template = require('./template');

module.exports = function ({term, type, line}) {
  Template.call(this, {term, type, line});
  this.root = 'home';
  this.filename = 'index';
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
   * Insert item into Home Index
   * @param {string} t - Term
   * @param {string} b - Bref
   * @return {string} Item
   */
  function _row (t, b) {
    const url = t.toUrl();
    return `<li><a href="./${url}.html">${t.toCap()}</a>`;
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
      term !== n && (html += _row(term, line['?']));
    }

    return l > 0 ? `<ul class="c3">${html}</ul>` : '';
  }

  /**
   * Render Home page
   * @return {string} Content
   */
  this.render = () => {
    return [
      this.head(),
      this.header(),
      '<main>',
      this.core(),
      _index(this.id),
      '</main>',
      this.footer(),
      this.search()
    ].join('');
  }
}
