module.exports = {
  merge (stuff) {
    return stuff.reduce((html, v) => html += v, '');
  }
}
