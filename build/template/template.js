const Runic = require('../lib/runic');

module.exports = function ({term, root, line}) {
  Object.assign(this, {id: term, file: term.toUrl(), root});

  /**
   * Build document head
   * @return {string} Head
   */
  this.head = () => {
    return [
      '<!doctype html><meta charset="utf-8">',
      '<meta name="viewport"content="width=device-width,initial-scale=1">',
      `<title>${this.id.toCap()}</title>${this.meta()}`,
      `<link rel="stylesheet"href="../s.css">`
    ].join('');
  }

  /**
   * Build meta
   * @return {string} Meta
   */
  this.meta = () => {
    return '<meta name="author" content="Avanier">';
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
    return `${u}<input id="s"value="${id.toCap()}"placeholder="⧃" spellcheck="false"autocomplete="off">`;
  }

  /**
   * Build core
   * @return {string} Core
   */
  this.core = () => {
    return new Runic(line).parse();
  }

  /**
   * Build footer
   * @return {string} Footer
   */
  this.footer = () => {
    const rURL = 'https://webring.xxiivv.com/#random';
    const mURL = 'https://merveilles.town/@joshavanier';
    return [
      `<footer><p><a href="./josh.html">JA</a> `,
      `© 2017&ndash;${new Date().getFullYear()}</p>`,
      `<a href="${rURL}"><img id="w"src="m/r.svg"alt="Ring"></a>`,
      `<a href="${mURL}"target="_blank">`,
      `<img id="m"src="m/m.svg"alt="Town"></a></footer>`
    ].join('');
  }

  /**
   * Link search script
   * @return {string} Script link
   */
  this.search = () => `<script src="../s.js"></script>`;
}
