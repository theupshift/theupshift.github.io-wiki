function DatabaseNode(id, rect) {
  Node.call(this, id, rect);

  this.glyph = NODE_GLYPHS.builder;
  this.cache = null;

  this.receive = q => {
    this.cache = this.cache ? this.cache : this.request();
    this.send(this.request(this.cache));
  }
}
