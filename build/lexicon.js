const fs = require('fs');
module.exports = function (pages) {
  this.build = () => {
    console.log('Building lexicon...');
    const info = `const lexicon = ${JSON.stringify(Object.keys(pages))}`;
    fs.writeFile('./lexicon.js', info, (err) => {
      err && console.error(err);
    });
  }
}
