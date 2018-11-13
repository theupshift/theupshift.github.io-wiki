function RouterNode (id) {
  Node.call(this, id);

  this.receive = (q) => {
    const tables = this.request('database').database;
    const name = q.toUpperCase();
    const type = this.find(name, tables);

    this.send({
      name, type, tables,
      result: tables[type] ? tables[type][name] : null
    });
  }

  this.find = (key, db) => {
    for (let id in db) {
      if (db[id][key]) return id;
    }
    return null;
  }
}
