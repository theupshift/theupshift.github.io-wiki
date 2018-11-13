function IndentalNode (id, type) {
  Node.call(this, id);
  this.type = type;

  this.answer = (q) => {
    if (this.cache) return this.cache;

    if (!DB[this.id]) {
      console.warn(`Missing database/${this.id}.tome`);
      return null;
    }

    this.cache = new Indental(DB[this.id]).parse(this.type);
    return this.cache;
  }
}
