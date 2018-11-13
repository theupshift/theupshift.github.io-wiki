function PageTemplate(id, ...params) {
  TemplateNode.call(this, id);

  this.answer = (q) => {
    if (!q.result) return this.signal('missing').answer(q);
    const {name, result: {bref, links, long, unde}} = q;

    return {
      title: capitalise(name),
      v: {
        u: `<a onclick="Ø('query').bang('${unde}')">${unde}</a>`,
        s: name,
        c: this.signal(name) ? this.signal(name).answer(q) : long
      }
    }
  }
}
