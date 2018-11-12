function DocumentNode (id) {
  Node.call(this, id);

  this.receive = (content = {title: 'Unknown'}) => {
    document.title = content.title;
  }
}
