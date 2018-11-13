function IndexTemplate(id, ...params) {
  TemplateNode.call(this, id);

  this.answer = (q) => {
    const {name, result: {unde, long}, tables: {lexicon, horaire}} = q;

    return {
      title: capitalise(name),
      v: {
        u: `<a onclick="Ø('query').bang('${unde}')">${unde}</a>`,
        s: name,
        c: `${long}${this.makeIndex(name, lexicon, horaire)}`
      }
    }
  }

  this.makeIndex = (name, lexicon, logs, stop = false) => {
    let html = '';
    let children = [];

    for (let id in lexicon) {
      const term = lexicon[id];
      if (!term.unde || name != term.unde.toUpperCase()) continue;
      children[children.length] = term;
    }

    for (let id in children) {
      const child = children[id];
      const {name} = child;
      const link = `<a onclick="Ø('query').bang('${child.name}')">${capitalise(child.name)}</a>`

      html += `<dt>${link}</dt><dd>${toMarkup(child.bref)}</dd></hs>
      ${!stop ? this.makeIndex(child.name,lexicon,logs,true) : ''}`;
    }

    return children.length > 0 ? `<dl>${html}</dl>` : '';
  }
}
