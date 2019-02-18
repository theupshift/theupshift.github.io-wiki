const Runic = require('../lib/runic');

module.exports = function ({term, root, type, line}) {
  Object.assign(this, {id: term, file: term.toUrl(), root, type});

  /**
   * Build document head
   * @return {string} Head
   */
  this.head = () => {
    return [
      '<!doctype html><meta charset="utf-8">',
      '<meta name="viewport"content="width=device-width,initial-scale=1">',
      `<title>${this.id.toCap()}</title>${this.meta()}`,
      this.css()
    ].join('');
  }

  /**
   * Build meta
   * @return {string} Meta
   */
  this.meta = () => '<meta name="author"content="Avanier">';

  /**
   * Create CSS link
   * @return {string} Link
   */
  this.css = () => {
    let c = '';
    switch (this.type) {
      case 'home': c = 'a'; break;
      case 'status': c = 'b'; break;
      case 'portal': c = 'c'; break;
      default: c = 'd'; break;
    }
    return `<link href="../${c}.css"rel="stylesheet">`;
  }

  /**
   * Build header
   * @return {string} Header
   */
  this.header = () => {
    const {id, root} = this;
    const u = id === 'HOME' ? '&mdash;' : `<a href="${
      root === 'HOME' ? 'index' : root.toUrl()
    }.html">${root.toCap()}</a>`;
    return `${u}<input id="s"value="${id.toCap()}"placeholder="⧃"spellcheck="false"autocomplete="off">`;
  }

  /**
   * Build core
   * @return {string} Core
   */
  this.core = () => new Runic(line).parse();

  /**
   * Build footer
   * @return {string} Footer
   */
  this.footer = () => {
    return `<a href="copyright.html">&copy; 2017&ndash;${new Date().getFullYear()}</a>`;
  }

  /**
   * Link search script
   * @return {string} Script link
   */
  this.search = () => `<script src="../s.js"></script>`;
}
