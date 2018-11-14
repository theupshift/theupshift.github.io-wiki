function TemplateNode (id) {
  Node.call(this, id);
  this.cache = null;

  this.receive = (q) => {
    const {result} = q;
    const type = result && result.type ? result.type : 'page';
    let assoc = this.signal(type);

    if (!assoc) {
      if (type !== 'none') console.warn(`Missing template: ${type}`);
      assoc = this.signal('page');
    }

    this.send(assoc.answer(q));
    document.body.append(this.signal('v').answer());
  }

  this.findSiblings = (parent, lexicon) => {
    let a = [];
    const P = parent.toUpperCase();
    for (let id in lexicon) {
      const term = lexicon[id];
      if (!term.unde || !parent || P !== term.unde.toUpperCase()) continue;
      a[a.length] = term;
    }
    return a;
  }

  this.findChildren = (name, lexicon) => {
    let a = [];
    let n = capitalise(name);
    for (let id in lexicon) {
      const term = lexicon[id];
      if (!term.unde || n !== term.unde) continue;
      a[a.length] = term;
    }
    return a;
  }
}
