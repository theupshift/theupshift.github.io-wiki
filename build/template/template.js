const Runic = require('../lib/runic');

module.exports = function ({term, unde, type, line}) {
  this.id = term.toLowerCase();
  this.parent = unde || 'Home';
  this.filename = this.id.toUrl();

  /**
   * Build document head
   * @param {boolean=} mode - Subsurface?
   * @return {string} Head
   */
  this.head = (mode = true) => {
    const id = this.id;
    const css = `${mode ? '..' : '.'}/s.css`;

    return [
      '<!doctype html><html lang="en"><meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      `<title>${this.id.toCap()}</title>`,
      this.meta(),
      `<link rel="stylesheet" href="${css}"/>`
    ].join('');
  }

  /**
   * Build meta
   * @return {string} Meta
   */
  this.meta = () => {
    return [
      '<meta name="author" content="Avanier">',
      '<meta name="description" content="The Athenaeum is Josh Avanier\'s wiki">',
      '<meta name="thumbnail" content="https://joshavanier.github.io/img/av.png" />',
      '<meta name="twitter:card" content="summary">',
      '<meta name="twitter:site" content="@joshavanier">',
      `<meta name="twitter:title" content="The Athenaeum">`,
      `<meta name="twitter:description" content="The Athenaeum is Josh Avanier\'s wiki">`,
      '<meta name="twitter:creator" content="@joshavanier">',
      `<meta name="twitter:image" content="https://joshavanier.github.io/img/josh.png">`
    ].join('');
  }

  /**
   * Build header
   * @param {boolean=} mode - Subsurface?
   * @return {string} Header
   */
  this.header = (mode = true) => {
    const {id, parent} = this;
    const unde = !mode ? '&mdash;'
      : `<a href=".${parent === 'Home' ? './index' : `/${parent.toUrl()}`}.html">${parent.toCap()}</a>`;
    return `<p id=u>${unde}</p><input id=s value="${id.toCap()}" spellcheck=false autocomplete=off>`;
  }

  /**
   * Build core
   * @return {string} Core
   */
  this.core = () => {
    return `${Object.keys(line).reduce((acc, term) => {
      const l = line[term];
      return `${Array.isArray(l) ? new Runic(l).parse() : l}`;
    }, '')}`.trim();
  }

  /**
   * Build footer
   * @param {boolean=} mode - Subsurface?
   * @return {string} Footer
   */
  this.footer = (mode = true) => {
    const josh = `.${mode ? '' : '/wiki'}/josh.html`;
    const pref = mode ? '.' : '';
    const ring = `${pref}./img/rotonde.svg`;
    const merv = `${pref}./img/merveilles.svg`;
    const rURL = 'http://webring.xxiivv.com/#random';
    const mURL = 'https://merveilles.town/@joshavanier';

    return [
      `<footer><a title="Ring" href="${rURL}" target="_blank">`,
      `<img id="w" src="${ring}" alt="Webring">`,
      `</a><a title="Town" href="${mURL}" target="_blank">`,
      `<img id="m" src="${merv}" alt="Merveilles">`,
      `</a><p><a title="Josh Avanier" href="${josh}">JA</a> © 2017&ndash;${new Date().getFullYear()}</footer>`
    ].join('');
  }

  /**
   * Link search script
   * @param {boolean=} mode - Subsurface?
   * @return {string} Script link
   */
  this.search = (mode = true) => {
    return `<script src="${mode ? '.' : ''}./search.js"></script>`;
  }
}
