const fs = require('fs')
module.exports = function (pages) {
  this.build = _ => {
    let info = 'var lexicon = "', tmp = ''
    for (let i in pages) tmp += `${i}|`
    info += `${tmp.substring(tmp.length - 1, 0)}".split('|')`
    fs.writeFile('./l.js', info, (err) => err && console.error(err))
  }
}
