function RouterNode (id) {
  Node.call(this, id);

  this.receive = (q) => {
    const db = this.request('database').database;
    const name = q.toUpperCase();
    const type = find(name, db);

    this.send({
      name, type,
      tables: db,
      result: db[type] ? db[type][name] : null,
    });

    function find (key, db) {
      for (let id in db) {
        if (db[id][key]) return id;
      }
      return null;
    }
  }
}
