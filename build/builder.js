const fs = require('fs');
module.exports = function (pages) {
  this.build = () => {
    for (const id in pages) {
      const page = pages[id];
      fs.writeFile(page.path, page.render(), (err) => {
        err && console.error(err);
      });
    }
  }
}
