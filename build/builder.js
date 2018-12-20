const fs = require('fs');
module.exports = function (pages) {
  this.build = () => {
    console.log('Building pages...');
    for (const id in pages) {
      const page = pages[id];
      fs.writeFile(page.path, page.render(), (err) => {
        err && console.error(err);
      });
    }
  }
}
