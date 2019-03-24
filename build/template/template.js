const Runic = require('../lib/runic')
module.exports = function ({term, root, type, line}) {
  Object.assign(this, {id: term, file: term.toUrl(), root, type})
  const ps = {home:'a', status:'b', portal:'c'}

  this.title = _ => `<title>${this.id.toCap()}</title>`
  this.meta = _ => '<meta name="author"content="Avanier">'
  this.core = _ => new Runic(line).parse()

  this.head = _ => {
    return [
      '<!doctype html><html lang="en"><meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      this.title(), this.meta(), this.css()
    ].join('')
  }

  this.css = _ => {
    const s = ps[this.type] || 'd'
    return `<link href="../${s}.css"rel="stylesheet">`
  }

  this.header = _ => {
    const {id, root} = this
    const u = id === 'HOME' ? '—' : `<a id="u"href="${
      root === 'HOME' ? 'index' : root.toUrl()
    }.html">${root.toCap()}</a>`
    return `${u}<h1>${id.toCap()}</h1>`
  }

  this.footer = _ => {
    const y = new Date().getFullYear().toString().slice(-2)
    return `<a id="c"href="copyright.html">© 2017–${y}</a>`
  }
}
