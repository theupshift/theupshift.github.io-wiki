function PortalTemplate(id, ...params) {
  TemplateNode.call(this, id);

  this.answer = (q) => {
    const {result: {long, links, unde}, name, tables: {lexicon}} = q;
    const children = this.findChildren(name, lexicon);

    return {
      title: capitalise(q.name),
      v: {
        u: `<p><a onclick="Ø('query').bang('${unde}')">${unde}</a></p>`,
        s: name,
        c: `${long}${this.makePortal(name, children)}`
      }
    }
  }

  this.makePortal = (name, children, logs) => {
    let html = '<dl>';
    for (let i = 0; i < children.length; i++) {
      const {name, bref} = children[i];
      const query = `Ø('query').bang('${name.toUpperCase()}')`;
      const title = `<dt><a onclick="${query}">${capitalise(name)}</a></dt>`;
      html += `${title}<dd>${toMarkup(bref)}</dd>`;
    }
    return `${html}</dl>`;
  }
}
