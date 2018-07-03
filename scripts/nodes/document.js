function DocumentNode(id, rect, ...params) {
  Node.call(this, id, rect);

  this.glyph = NODE_GLYPHS.render;

  this.receive = (content = {title: 'Unknown'}) => {
    document.title = content.title;
    this.label = `document=${content.title}`;
  }

  const replace_url = url => {
    window.location.hash = '';
    history.pushState({}, null, url);
  }
}
