const Runic = require('../lib/runic');

module.exports = function ({term, unde, type, line}) {
  this.id = term.toLowerCase();
  this.parent = unde || 'Home';
  this.filename = this.id.toUrl();

  this.core = (id, parent) => _core(id, parent);

  function _template (acc, term) {
    return `${Array.isArray(line[term]) ? new Runic(line[term]).parse() : line[term]}`;
  }

  function _core (id, parent, content) {
    return `${Object.keys(line).reduce(_template, '')}`.trim()
  }

  this.head = () => {
    const css = `${this.id === 'home' ? '.' : '..'}/s.css`;
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="author" content="Josh Avanier"><title>${this.id.toCapitalCase()}</title><link rel="stylesheet" href="${css}"/>`;
  }

  this.header = () => {
    let unde = '';
    if (this.id === 'home') {
      unde = '&mdash;'
    } else {
      unde = `<a href=".${this.parent === 'Home' ? './index' : `/${this.parent.toUrl()}`}.html">${this.parent.toCapitalCase()}</a>`;
    }
    return `<p id="u">${unde}</p><input id="s" value="${this.id.toCapitalCase()}" spellcheck="false">`;
  }

  this.footer = () => {
    let josh = '', ring = '';
    if (this.id === 'home') {
      ring = './img/rotonde.svg';
      josh = './wiki/josh.html';
    } else {
      ring = '../img/rotonde.svg';
      josh = './josh.html';
    }
    return `<footer id="f"><a title="Kin" href="http://webring.xxiivv.com/#random" target="_blank"><img id="w" src="${ring}"></a><p><a href="${josh}">Josh Avanier</a> © Éternité</footer>`;
  }
}
