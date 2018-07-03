function IndentalNode(id, rect, type) {
  Node.call(this, id, rect);

  this.type = type;
  this.glyph = NODE_GLYPHS.database;

  this.answer = q => {
    if (!DATABASE[this.id]) {
      console.warn(`Missing /database/${this.id}.js`);
      return null;
    }

    if (this.cache) return this.cache;

    this.label = this.type ? `${this.id}=${this.type.name}` : `${this.id}`;
    this.cache = new Indental(DATABASE[this.id]).parse(this.type);
    console.log(this.cache);
    return this.cache;
  }
}

var DATABASE = {};
