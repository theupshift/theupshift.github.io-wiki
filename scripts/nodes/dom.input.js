function InputNode (id, ...params) {
  DomNode.call(this, id, ...params);

  this.isInstalled = false;
  this.el = document.createElement('input');
  Object.assign(this.el, {id: this.id, spellcheck: false});

  this.el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') this.validate(this.el.value.trim());
  });

  this.el.addEventListener('focus', () => {
    this.txt = this.el.value;
    this.el.value = '';
  });

  this.el.addEventListener('blur', () => {
    this.el.value = this.txt ?
      this.txt : window.location.hash.replace('#', '').trim();
  });

  this.validate = (value) => Ø('query').bang(value);

  this.update = (content) => {
    if (typeof content === 'string') this.el.value = content.capitalize();
  }
}
