const Page = require('./template/page')
const Home = require('./template/home')
const Portal = require('./template/portal')
const Status = require('./template/status')
const LogSet = require('./lib/set')
module.exports = function (tables, logs) {
  this.pages = {}
  database = tables

  function _standard (p, {data: {pro}} = logs) {
    const {term} = p
    return new Page(p, new LogSet(term in pro ? pro[term] : []))
  }

  function _render (p) {
    switch (p.type) {
      case 'home': return new Home(p)
      case 'portal': return new Portal(p)
      case 'status': return new Status(p, logs)
      default: return _standard(p)
    }
  }

  for (let id in tables) this.pages[id] = _render(tables[id])
}
