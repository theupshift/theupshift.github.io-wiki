const Template = require('./template')
const LogSet = require('../lib/set')
module.exports = function ({term, type, line}) {
  Template.call(this, {term, type, line})
  Object.assign(this, {
    root: 'HOME',
    file: 'index',
    path: './wiki/index.html'
  })

  function _getChildren (n, db = database) {
    let scion = [], temp = []
    for (let id in db) {
      const term = db[id]
      if (!term.root || n !== term.root) continue
      if (term.term === 'COPYRIGHT') continue
      temp[temp.length] = term
    }

    const sorted = Object.keys(temp).sort((a, b) =>
      (temp[a].term > temp[b].term) ? 1 : -1
    )

    for (let i = 0, l = sorted.length; i < l; i++)
      scion[scion.length] = temp[sorted[i]]

    return scion
  }

  function _row (t) {
    return `<li><a href="${t.toUrl()}.html">${t.toCap()}</a>`
  }

  function _index (name = term) {
    const scion = _getChildren(name)
    const l = scion.length
    let html = ''

    for (let i = 0; i < l; i++) {
      const {term, line} = scion[i]
      term !== name && (html += _row(term))
    }

    html += '<li><a href="https://webring.xxiivv.com/#random">Webring</a>'

    return l > 0 ? `<ul>${html}</ul>` : ''
  }

  this.render = () => {
    return [
      this.head(), this.core(), _index(), this.footer()
    ].join('')
  }
}
