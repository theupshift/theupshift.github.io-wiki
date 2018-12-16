const fs = require('fs');
module.exports = function Builder (pages) {
  this.build = () => {
    for (const id in pages) {
      const page = pages[id];
      const render = page.render();
      const path = `./joshavanier.github.io/${page.filename}.html`;
      fs.writeFile(path, render, (err) => {
        err && console.error(err);
      });
    }
  }
}
