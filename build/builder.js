const fs = require('fs');
module.exports = function Builder (pages) {
  this.build = () => {
    for (const id in pages) {
      const page = pages[id];
      const render = page.render();
      fs.writeFile(page.path, render, (err) => {
        err && console.error(err);
      });
    }
  }
}
