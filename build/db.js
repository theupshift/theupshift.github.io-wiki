const fs = require('fs');
module.exports = function (folder) {
  this.store = {};
  const files = fs.readdirSync(folder);
  for (let id in files) {
    const file = files[id];
    if (file.indexOf('.tome') < 0) continue;
    this.store[file] = fs.readFileSync(
      `${folder}/${file}`, 'utf8'
    );
  }
}
