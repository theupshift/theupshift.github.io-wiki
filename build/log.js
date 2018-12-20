const fs = require('fs');
const Entry = require('./lib/entry')

/**
 * Convert hexadecimal to decimal
 * @param {string} h
 * @return {number} Decimal
 */
function convertHex (h) {
   return parseInt(h, 16);
}

/**
 * Convert hex time to epoch time
 * @param {string} h
 * @return {number} Epoch time
 */
function toEpoch (h) {
  return new Date(convertHex(h) * 1E3);
}

module.exports = function Log (file) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8')).log;

  this.raw = [];
  this.data = {sec: {}, pro: {}};
  this.sectors = [];
  this.projects = [];

  for (let i = 0, l = raw.length; i < l; i++) {
    const {s, e, c, t, d} = raw[i];
    const sec = c.toUpperCase();
    const pro = t.toUpperCase();

    const a = toEpoch(s);
    const b = e === undefined ? undefined : toEpoch(e);

    if (sec in this.data.sec) {
      this.data.sec[sec].push(new Entry({s: a, e: b, t}));
    } else {
      this.data.sec[sec] = [new Entry({s: a, e: b, t})];
    }

    if (pro in this.data.pro) {
      this.data.pro[pro].push(new Entry({s: a, e: b, c}))
    } else {
      this.data.pro[pro] = [new Entry({s: a, e: b, c})]
    }

    this.raw[this.raw.length] = new Entry({s: a, e: b, c, t});
  }

  this.sectors = Object.keys(this.data.sec);
  this.projects = Object.keys(this.data.pro);
}
