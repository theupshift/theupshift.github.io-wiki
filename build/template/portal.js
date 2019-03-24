const Template = require('./template')
module.exports = function ({term, root, type, line}) {
  Template.call(this, {term, root, type, line})
  this.path = `./wiki/${this.file}.html`

  function _getChildren (n, db = database) {
    let scion = [], temp = []
    for (let id in db) {
      const term = db[id]
      if (!term.root || n !== term.root) continue
      temp[temp.length] = term
    }

    const sorted = Object.keys(temp).sort((a, b) => {
      return (temp[a].term > temp[b].term) ? 1 : -1
    })

    for (let i = 0, l = sorted.length; i < l; i++)
      scion[scion.length] = temp[sorted[i]]

    return scion
  }

  function _ins (t, f) {
    return `<a href="${t.toUrl()}.html">${t.toCap()}</a> ${f ? '' : '†'}<br>`
  }

  function _index (t) {
    const c = _getChildren(t)
    const i = c.reduce((v, {term, fin}) => v += _ins(term, fin), '')
    return c.length > 0 ? `<p class="x">${i}` : ''
  }

  this.render = () => {
    return [
      this.head(), this.header(),
      `<main>${this.core()}${_index(this.id)}</main>`,
      this.footer()
    ].join('')
  }
}
