const fs = require('fs');
module.exports = function (pages) {
  this.build = () => {
    const info = `const lexicon = ${JSON.stringify(Object.keys(pages))}`;
    fs.writeFile('./l.js', info, (err) => {err && console.error(err)});
  }
}
