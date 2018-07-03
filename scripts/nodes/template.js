function TemplateNode(id, rect) {
  Node.call(this, id, rect);

  this.glyph = NODE_GLYPHS.parser;
  this.cache = null;

  this.receive = q => {
    const result = q.result;
    let type = result && result.type ? result.type.toLowerCase() : 'page';
    let assoc = this.signal(type);

    if (!assoc && assoc != 'none') {
      console.warn(`Missing template: ${type}`);
      assoc = this.signal('page');
    }

    this.send(assoc.answer(q));
    this.label = `template:${assoc.id}`;

    setTimeout(() => {Ø('view').el.className = 'ready'}, 100);

    document.body.appendChild(this.signal('view').answer());
  }

  this.find_siblings = (parent, lexicon) => {
    let a = [];
    for (let id in lexicon) {
      const term = lexicon[id];
      if (!term.unde() || !parent || parent.toUpperCase() !== term.unde().toUpperCase()) continue;
      a[a.length] = term;
    }
    return a;
  }

  this.find_children = (name, lexicon) => {
    let a = [];
    for (let id in lexicon) {
      const term = lexicon[id];
      if (!term.unde() || name !== term.unde().toUpperCase()) continue;
      a[a.length] = term;
    }
    return a;
  }

  this.make_table = (term, lexicon, parent, depth = 3, selection = null) => {
    if (depth <= 0) return '';
    let children = this.find_children(term.name, lexicon);
    const cl = children.length;
    if (cl === 0) return '';

    let html = '';

    if (depth === 2) {
      for (let id in children) {
        const child = children[id];
        const cap = child.name.capitalize();
        const table = this.make_table(child, lexicon, parent, depth-1, selection);

        html += `<details ${selection && child.name === selection.name ?
          'open' : ''} class="depth2"><summary class='${selection && child.name === selection.name ?
          'selected' : ''}'>{{${cap}}}</summary>${table}</details>`.to_markup();
      }

      return html;
    }

    if (depth === 1) {
      for (let id in children) {
        const child = children[id];
        const cap = child.name.capitalize();

        html += `<details ${selection && child.name === selection.name ?
          'open' : ''} class="depth2"><summary class='${selection && child.name === selection.name ?
          'selected' : ''}'>{{${cap}}}</summary></details>`.to_markup();
      }

      return html;
    }

    html += '<nav>';
    for (let id in children) {
      const child = children[id];
      const cap = child.name.capitalize();
      const table = this.make_table(child, lexicon, parent, depth-1, selection);

      html += `<details ${(selection && child.name === selection.name) || (selection && cap === parent) ?
        'open' : ''}><summary class='${selection && ((child.name === selection.name) || (parent === child.name.capitalize())) ?
        'selected' : ''}'>{{${cap}}}</summary>${table}</details>`.to_markup();
    }
    html += '</nav>';

    return html;
  }

  this.make_navi = (term, parent, lexicon) => {
    const portal = this.find_portal(term, lexicon);

    if (!portal) {
      console.log('No portal found');
      return '';
    }

    return this.make_table(portal, lexicon, parent, 3, term);
  }

  this.find_portal = (term, lexicon) => {
    if (!lexicon[term.unde().toUpperCase()]) {
      console.warn('Parent is missing');
      return '';
    }

    let portal = null;
    const parent = lexicon[term.unde().toUpperCase()];

    if (term.type && term.type.toLowerCase() === 'portal') {
      portal = term;
    } else if (parent.is_portal) {
      portal = parent;
    } else {
      var parent_parent = lexicon[parent.unde().toUpperCase()];
      if (parent_parent.is_portal) {
        portal = parent_parent;
      } else {
        var parent_parent_parent = lexicon[parent_parent.unde().toUpperCase()];
        if (parent_parent_parent.is_portal) {
          portal = parent_parent_parent;
        }
      }
    }

    return portal;
  }
}
