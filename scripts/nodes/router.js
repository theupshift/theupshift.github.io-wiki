function RouterNode(id, rect) {
  Node.call(this, id, rect);

  this.glyph = NODE_GLYPHS.parser;

  this.receive = q => {
    q = q.toUpperCase();
    const db = this.request('database').database;
    const type = find(q, db);

    this.label = `router:${type}/${q}`;
    this.send({
      name: q,
      type: type,
      result: db[type] ? db[type][q] : null,
      tables: db,
    });
  }

  const find = (key, db) => {
    for (let id in db) {
      if (db[id][key]) return id;
    }
    return null;
  }
}
