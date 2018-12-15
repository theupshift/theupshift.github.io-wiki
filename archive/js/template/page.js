function PageTemplate (id, ...params) {
  Template.call(this, id);

  this.answer = q => {
    if (!q.result) return this.signal('missing').answer(q);
    const {name, result: {long, unde}} = q;

    return {
      title: capitalise(name),
      v: {
        c: this.signal(name) ? this.signal(name).answer(q) : long,
        u: `<a onclick="Q('q').bang('${unde}')">${unde}</a>`,
        s: name,
      }
    }
  }
}
