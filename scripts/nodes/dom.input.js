function InputNode(id, rect, ...params) {
  DomNode.call(this, id, rect, ...params);

  this.el = document.createElement('input');
  this.el.id = this.id;
  this.is_installed = false;
  this.el.setAttribute('spellcheck', false);

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

  this.validate = value => {
    Ø('query').bang(value);
  }

  this.update = content => {
    if (typeof content === 'string') this.el.value = content.capitalize();
  }
}
