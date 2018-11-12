function IndentalNode (id, type) {
  Node.call(this, id);
  this.type = type;

  this.answer = (q) => {
    if (!DB[this.id]) {
      console.warn(`Missing /database/${this.id}.js`);
      return null;
    }

    if (this.cache) return this.cache;

    this.cache = new Indental(DB[this.id]).parse(this.type);
    return this.cache;
  }
}
