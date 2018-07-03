function DocsTemplate(id, rect, ...params) {
  TemplateNode.call(this, id, rect);

  this.glyph = NODE_GLYPHS.template;
  this.archives = [];
  this.term = null

  this.answer = q => {
    const filename = q.result.name.to_url();
    this.invoke(filename);

    return {
      title: q.name.capitalize(),
      view: {
        header: {
          photo: q.result.scrn() || 'memex.png',
          search: q.name,
        },
        core: {
          sidebar: {
            bref: make_bref(q.result, q.tables.lexicon)
          },
          content: `<p>${q.result.bref()}</p>${q.result.long()}${this.load(filename)}`,
        }
      }
    }
  }

  this.invoke = filename => {
    if (this.archives[filename]) {
      this.load(filename);
      return;
    }

    let s = document.createElement('script');
    s.src = `docs/${filename}.tome`;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.seal = (name, payload = null) => {
    this.archives[name] = payload;
    Ø('content').update(this.term && this.term ? this.term.long() + this.load(name) : this.load(name));
  }

  this.load = key => {
    if (!this.archives[key]) return `<p>Loading ${key}..</p>`;

    const data = new Indental(this.archives[key]).parse();
    let html = '';

    for (let id in data) {
      html += `<h3>${id.capitalize()}</h3>${new Runic(data[id])}`;
    }

    return html;
  }

  const make_bref = (term, lexicon) => {
    return `<p><a onclick="Ø('query').bang('${term.unde()}')">${term.unde()}</a></p>
    ${this.make_navi(term, (term.unde() || ''), lexicon)}
    `;
  }
}
