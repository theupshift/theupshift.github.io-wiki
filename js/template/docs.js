function DocsTemplate(id, ...params) {
  TemplateNode.call(this, id);
  Object.assign(this, {archives: [], term: null});

  this.answer = (q) => {
    const {result, name, tables} = q;
    const {bref, long} = result;
    const filename = result.name.to_url();
    this.invoke(filename);

    return {
      title: capitalise(name),
      v: {
        s: name,
        c: `${long}${this.load(filename)}`
      }
    }
  }

  this.invoke = (filename) => {
    if (this.archives[filename]) {
      this.load(filename);
      return;
    }

    document.getElementsByTagName('head')[0].appendChild(
      Object.assign(document.createElement('script'), {
        src: `docs/${filename}.tome`
      })
    );
  }

  this.seal = (name, payload = null) => {
    this.archives[name] = payload;
    Q('content').update(this.term && this.term ? this.term.long + this.load(name) : this.load(name));
  }

  this.load = (key) => {
    if (!this.archives[key]) return `<p>Loading ${key}..</p>`;

    const data = new Indental(this.archives[key]).parse();
    let html = '';

    for (let id in data) {
      html += `<h3>${capitalise(id)}</h3>${new Runic(data[id])}`;
    }

    return html;
  }
}
