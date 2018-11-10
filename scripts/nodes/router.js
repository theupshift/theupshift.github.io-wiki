function RouterNode (id) {
  Node.call(this, id);

  this.receive = (q) => {
    const name = q.toUpperCase();
    const db = this.request('database').database;
    const type = find(name, db);

    this.label = `router:${type}/${name}`;
    this.send({
      name,
      type: type,
      result: db[type] ? db[type][name] : null,
      tables: db,
    });

    function find (key, db) {
      for (let id in db) {
        if (db[id][key]) return id;
      }
      return null;
    }
  }
}
