const fs = require('fs')
const Entry = require('./lib/entry')
module.exports = function (file) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8')).log
  this.data = {sec: {}, pro: {}}
  this.raw = []

  const _epoch = h => new Date(parseInt(h, 16) * 1E3)

  for (let i = 0, l = raw.length; i < l; i++) {
    const {s, e, c, t} = raw[i]
    if (e === undefined) continue
    const a = _epoch(s)
    const b = _epoch(e)
    const sec = c.toUpperCase()
    const pro = t.toUpperCase()
    const ent = new Entry({s:a, e:b, c, t})

    sec in this.data.sec
      ? (this.data.sec[sec][this.data.sec[sec].length] = ent)
      : (this.data.sec[sec] = [ent])

    pro in this.data.pro
      ? (this.data.pro[pro][this.data.pro[pro].length] = ent)
      : (this.data.pro[pro] = [ent])

    this.raw[this.raw.length] = ent
  }
}
