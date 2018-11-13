function DomNode (id, ...params) {
  Node.call(this, id);
  this.type = params[0] ? params[0] : 'div';
  this.el = Object.assign(document.createElement(this.type), {id});
  this.isInstalled = false;

  if (params[1]) this.el.innerHTML = params[1];

  this.receive = (content) => {
    if (content && content[this.id] !== null) {
      this.update(content[this.id]);
      this.send(content[this.id]);
    }
  }

  this.answer = () => {
    if (!this.isInstalled) this.install(this.request());
    return this.el;
  }

  this.install = (elements) => {
    for (let id in elements) this.el.append(elements[id]);
    this.isInstalled = true;
  }

  this.update = (content) => {
    if (typeof content !== 'string') return;
    Object.assign(this.el, {
      innerHTML: content, className: !content ? 'empty' : ''
    });
  }
}
