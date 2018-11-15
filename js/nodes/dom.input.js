function InputNode (id, ...params) {
  DomNode.call(this, id, ...params);

  this.isInstalled = false;
  this.el = document.createElement('input');

  Object.assign(this.el, {
    id,
    spellcheck: false,
    onkeydown: (e) => {
      if (e.key === 'Enter') this.validate(this.el.value.trim());
    },
    onblur: () => {
      this.el.value = capitalise(this.txt);
    },
    onfocus: () => {
      this.txt = this.el.value;
      Object.assign(this.el, {
        title: 'Search for a page or topic',
        placeholder: 'Search',
        value: ''
      });
    }
  });

  this.validate = (value) => {
    this.txt = value;
    Q('query').bang(value);
  }

  this.update = (content) => {
    this.txt = content;
    if (typeof content === 'string') {
      this.el.value = capitalise(content);
    }
  }
}
