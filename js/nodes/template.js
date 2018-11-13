function TemplateNode (id) {
  Node.call(this, id);
  this.cache = null;

  this.receive = (q) => {
    const {result} = q;
    const type = result && result.type ? result.type.toLowerCase() : 'page';
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
    for (let id in lexicon) {
      const term = lexicon[id];
      if (!term.unde || name !== term.unde.toUpperCase()) continue;
      a[a.length] = term;
    }
    return a;
  }

  this.findPortal = (term, lexicon) => {
    if (!lexicon[term.unde.toUpperCase()]) {
      console.warn(`Missing parent: ${term.unde}`);
      return '';
    }

    let portal = null;
    const parent = lexicon[term.unde.toUpperCase()];
    const punde = parent.unde.toUpperCase();

    if (term.type && term.type.toLowerCase() === 'portal') {
      portal = term;
    } else if (parent.isPortal) {
      portal = parent;
    } else {
      const pp = lexicon[punde];
      if (pp.isPortal) portal = pp;
      else {
        const ppp = lexicon[pp.unde.toUpperCase()];
        if (ppp.isPortal) portal = ppp;
      }
    }

    return portal;
  }
}
