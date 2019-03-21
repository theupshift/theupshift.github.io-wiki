const Template = require('./template')
const LogSet = require('../lib/set')
module.exports = function ({term, type, line}, tables) {
  Template.call(this, {term, type, line})
  Object.assign(this, {
    root: 'HOME',
    file: 'index',
    path: './wiki/index.html'
  })

  /**
   * Get term children
   * @param {string} n
   * @param {Object=} db
   * @return {Array} Children
   */
  function _getChildren (n, db = database) {
    let scion = [], temp = []
    for (let id in db) {
      const term = db[id]
      if (!term.root || n !== term.root) continue
      temp[temp.length] = term
    }

    const sorted = Object.keys(temp).sort((a, b) =>
      (temp[a].term > temp[b].term) ? 1 : -1
    )

    for (let i = 0, l = sorted.length; i < l; i++)
      scion[scion.length] = temp[sorted[i]]

    return scion
  }

  /**
   * Insert item into Home Index
   * @param {string} t - Term
   * @return {string} Item
   */
  function _row (t) {
    return `<a href="${t.toUrl()}.html">${t.toCap()}</a><br>`
  }

  /**
   * Build Home Index
   * @param {string} name - Term
   * @return {string} Index
   */
  function _index (name) {
    const scion = _getChildren(name)
    const l = scion.length
    let html = ''

    for (let i = 0; i < l; i++) {
      const {term, line} = scion[i]
      term !== name && (html += _row(term, line['?']))
    }

    html += '<a href="https://webring.xxiivv.com/#random">Webring</a>'

    return l > 0 ? `<p class="x">${html}` : ''
  }

  /**
   * Build footer
   * @return {string} Footer
   */
  this.footer = () => {
    const y = new Date().getFullYear()
    return `<a id="c"href="copyright.html">© 2017&ndash;${y}</a>`
  }

  /**
   * Render Home page
   * @return {string} Content
   */
  this.render = () => {
    return [
      this.head(), this.header(),
      `<main>${this.core()}${_index(this.id)}</main>`,
      this.footer()
    ].join('')
  }
}
