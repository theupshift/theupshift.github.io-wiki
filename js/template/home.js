function HomeTemplate(id, ...params) {
  TemplateNode.call(this, id);

  this.answer = (q) => {
    const {name, result: {bref}} = q;
    const children = this.findChildren(name, q.tables.lexicon);

    return {
      title: capitalise(name),
      v: {
        u: '&mdash;',
        s: name,
        c: `${q.result.long}${makePortal(children)}`
      }
    }
  }

  function makePortal (children) {
    let html = '<dl>';

    for (let i = 1; i < children.length; i++) {
      const {name, bref} = children[i];
      const url = toURL(name);
      const term = capitalise(name);
      const title = `<a onclick="Q('query').bang('${url}')">${term}</a>`;
      html += `<dt>${title}</dt><dd>${toMarkup(bref)}</dd>`;
    }

    return `${html}</dl>`;
  }
}
