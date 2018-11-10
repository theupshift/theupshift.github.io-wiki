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
    this.label = `template:${assoc.id}`;

    setTimeout(() => {Ø('view').el.className = 'ready'}, 100);

    document.body.append(this.signal('view').answer());
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

  this.makeTable = (term, lexicon, parent, depth = 3, selection = null) => {
    if (depth <= 0) return '';
    let children = this.findChildren(term.name, lexicon);
    const cl = children.length;
    if (cl === 0) return '';

    // console.log(term, parent)

    let html = '';

    if (depth === 2) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const cap = child.name.capitalize();
        const table = this.makeTable(child, lexicon, parent, depth-1, selection);

        html += `
          <h2 ${selection && child.name === selection.name ?
          'open' : ''} class="depth2"></h2>
            <dd class='${selection && child.name === selection.name ? 'selected' : ''}'>{{${cap}}}
          <dl>${table}</dl></dd>
          `.toMarkup();
      }

      return html;
    }

    if (depth === 1) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const cap = child.name.capitalize();

        html += `<h2 ${selection && child.name === selection.name ?
          'open' : ''} class="depth2"></h2><dd class='${selection && child.name === selection.name ?
          'selected' : ''}'>{{${cap}}}</dd>`.toMarkup();
      }

      return html;
    }

    html += '<dl>';
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const cap = child.name.capitalize();
      const table = this.makeTable(child, lexicon, parent, depth-1, selection);

      html += `<dt ${(selection && child.name === selection.name) || (selection && cap === parent) ?
        'open' : ''}><dt class='${selection && ((child.name === selection.name) || (parent === child.name.capitalize())) ?
        'selected' : ''}'>{{${cap}}}MEOW</dt><dd>${table}</dd></dt>`.toMarkup();
    }
    html += '</dl>';

    html = ''

    return html;
  }

  this.makeNavi = (term, parent, lexicon) => {
    const portal = this.findPortal(term, lexicon);

    if (!portal) {
      console.log('No portal found');
      return '';
    }

    return this.makeTable(portal, lexicon, parent, 3, term);
  }

  this.findPortal = (term, lexicon) => {
    if (!lexicon[term.unde.toUpperCase()]) {
      console.warn(`Missing parent: ${term.unde}`);
      return '';
    }

    let portal = null;
    const parent = lexicon[term.unde.toUpperCase()];

    if (term.type && term.type.toLowerCase() === 'portal') {
      portal = term;
    } else if (parent.isPortal) {
      portal = parent;
    } else {
      const pp = lexicon[parent.unde.toUpperCase()];
      if (pp.isPortal) portal = pp;
      else {
        const ppp = lexicon[pp.unde.toUpperCase()];
        if (ppp.isPortal) portal = ppp;
      }
    }

    return portal;
  }
}
