function DatabaseNode (id) {
  Node.call(this, id);
  this.cache = null;

  this.receive = (q) => {
    this.cache = this.cache ? this.cache : this.request();
    this.send(this.request(this.cache));
  }
}
