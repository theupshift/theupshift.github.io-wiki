function IndexTemplate(id, ...params) {
  Template.call(this, id);

  this.answer = q => {
    const {name, result: {unde, long}, tables: {lexicon}} = q;
    return {
      title: capitalise(name),
      v: {
        u: `<a onclick="Q('q').bang('${unde}')">${unde}</a>`,
        c: `${long}${this.makeIndex(name, lexicon)}`,
        s: name
      }
    }
  }

  this.makeIndex = (name, lexicon, stop = false) => {
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
      const link = `<a onclick="Q('q').bang('${child.name}')">${capitalise(child.name)}</a>`

      html += `<dt>${link}</dt><dd>${toMarkup(child.bref)}</dd></hs>
      ${!stop ? this.makeIndex(child.name,lexicon,true) : ''}`;
    }

    return children.length > 0 ? `<dl>${html}</dl>` : '';
  }
}
