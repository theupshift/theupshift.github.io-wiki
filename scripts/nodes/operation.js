function OperationNode(id, rect, ...params) {
  Node.call(this, id, rect);

  this.glyph = NODE_GLYPHS.entry;

  this.request = q => {
    const operator = q.split(' ')[0].trim();
    let params = q.replace(operator, '').trim();

    params = params !== operator ? params : null;

    return this.signal(operator) ?
      this.signal(operator).answer(params) : `Unknown operator:(${operator})`;
  }
}
