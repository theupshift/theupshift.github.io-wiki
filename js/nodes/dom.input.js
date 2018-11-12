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
    Object.assign(this.el, {
      value: '',
      placeholder: 'Search',
      title: 'Search for a page or topic'
    });
  });

  this.el.addEventListener('blur', () => {
    this.el.value = this.txt.capitalize();
  });

  this.validate = (value) => {
    this.txt = value;
    Ø('query').bang(value);
  }

  this.update = (content) => {
    this.txt = content;
    if (typeof content === 'string') {
      this.el.value = content.capitalize();
    }
  }
}
