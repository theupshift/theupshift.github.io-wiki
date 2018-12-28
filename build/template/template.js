const Runic = require('../lib/runic');
const Utils = require('../lib/utils');

module.exports = function ({term, unde, type, line}) {
  this.id = term.toLowerCase();
  this.parent = unde || 'Home';
  this.filename = this.id.toUrl();

  this.head = (mode = true) => {
    const id = this.id;
    const css = `${mode ? '..' : '.'}/s.css`;

    return Utils.merge([
      '<!doctype html><html><meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      '<meta name="author" content="Avanier">',
      `<title>${this.id.toCapitalCase()}</title>`,
      `<link rel="stylesheet" href="${css}"/>`
    ]);
  }

  this.header = (mode = true) => {
    const {id, parent} = this;
    const unde = !mode ? '&mdash;'
      : `<a href=".${parent === 'Home' ? './index' : `/${parent.toUrl()}`}.html">${parent.toCapitalCase()}</a>`;
    return `<p id=u>${unde}</p><input id=s value="${id.toCapitalCase()}" spellcheck=false>`;
  }

  this.core = () => {
    return `${Object.keys(line).reduce((acc, term) => {
      const l = line[term];
      return `${Array.isArray(l) ? new Runic(l).parse() : l}`;
    }, '')}`.trim();
  }

  this.footer = (mode = true) => {
    const josh = `.${mode ? '' : '/wiki'}/josh.html`;
    const ring = `${mode ? '.' : ''}./img/rotonde.svg`;
    const merv = `${mode ? '.' : ''}./img/merveilles.svg`;
    const ringURL = 'http://webring.xxiivv.com/#random';
    const mervURL = 'https://merveilles.town/@joshavanier';

    return Utils.merge([
      `<footer><a title="Kin" href="${ringURL}" target="_blank">`,
      `<img id="w" src="${ring}" alt="Webring">`,
      `</a><a title="Town" href="${mervURL}" target="_blank">`,
      `<img id="m" src="${merv}" alt="Merveilles">`,
      `</a><p><a href="${josh}">Josh Avanier</a> © Éternité</footer>`
    ]);
  }

  this.search = (mode = true) => {
    return `<script src="${mode ? '.' : ''}./search.js"></script>`;
  }
}
