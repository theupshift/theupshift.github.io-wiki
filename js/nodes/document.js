function DocumentNode (id) {
  Node.call(this, id);

  this.receive = ({title}) => {
    document.title = title || 'Unknown';
  }
}
