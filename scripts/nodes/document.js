function DocumentNode (id) {
  Node.call(this, id);

  this.receive = (content = {title: 'Unknown'}) => {
    document.title = content.title;
    this.label = `document=${content.title}`;
  }
}
