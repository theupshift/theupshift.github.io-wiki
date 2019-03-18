const Runic = require('../lib/runic')
module.exports = function ({term, root, type, line}) {
  Object.assign(this, {id: term, file: term.toUrl(), root, type})

  /**
   * Build document head
   * @return {string} Head
   */
  this.head = _ => {
    return [
      '<!doctype html><html lang="en"><meta charset="utf-8">',
      '<meta name="viewport"content="width=device-width,initial-scale=1">',
      this.title(), this.meta(), this.css(), this.search()
    ].join('')
  }

  /**
   * Build title
   * @return {string} Title
   */
  this.title = _ => `<title>${this.id.toCap()}</title>`

  /**
   * Build meta
   * @return {string} Meta
   */
  this.meta = _ => '<meta name="author"content="Avanier">'

  /**
   * Create CSS link
   * @return {string} Link
   */
  this.css = _ => {
    let c = ''
    switch (this.type) {
      case 'home': c = 'a'; break
      case 'status': c = 'b'; break
      case 'portal': c = 'c'; break
      default: c = 'd'; break
    }
    return `<link href="../${c}.css"rel="stylesheet">`
  }

  /**
   * Build header
   * @return {string} Header
   */
  this.header = _ => {
    const {id, root} = this
    const u = id === 'HOME' ? '—' : `<a id="u"href="${
      root === 'HOME' ? 'index' : root.toUrl()
    }.html">${root.toCap()}</a>`
    return `${u}<h1><input id="s"value="${id.toCap()}"placeholder="Search"spellcheck="false"autocomplete="off"></h1>`
  }

  /**
   * Build core
   * @return {string} Core
   */
  this.core = _ => new Runic(line).parse()

  /**
   * Build footer
   * @return {string} Footer
   */
  this.footer = _ => {
    const y = new Date().getFullYear()
    return `<a id="c"href="copyright.html">© 2017–${y}</a>`
  }

  /**
   * Link search script
   * @return {string} Script link
   */
  this.search = _ => `<script defer src="../s.js"></script>`
}
