function DomNode(id, rect, ...params) {
  Node.call(this, id, rect);

  this.type = params[0] ? params[0] : 'yu';
  this.glyph = NODE_GLYPHS.dom;
  this.label = `${this.id}:${this.type}`;
  this.el = document.createElement(this.type);
  this.el.id = this.id;
  this.is_installed = false;

  if (params[1]) this.el.innerHTML = params[1];

  this.receive = content => {
    if (content && content[this.id] !== null) {
      this.update(content[this.id]);
      this.send(content[this.id]);
    }
  }

  this.answer = _ => {
    if (!this.is_installed) this.install(this.request());
    return this.el;
  }

  this.install = elements => {
    this.is_installed = true;
    for (let id in elements) {
      this.el.appendChild(elements[id]);
    }
  }

  this.update = content => {
    if (typeof content === 'string') {
      this.el.innerHTML = content;
      this.el.className = !content ? 'empty' : '';
    }
  }
}
