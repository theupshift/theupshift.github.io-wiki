function IndexTemplate(id, rect, ...params) {
  TemplateNode.call(this, id, rect);

  this.glyph = NODE_GLYPHS.template;

  this.answer = q => {
    return {
      title: q.name.capitalize(),
      view: {
        header: {
          photo: q.result.scrn() || 'memex.png',
          search: q.name,
        },
        core: {
          sidebar: {
            bref: make_bref(q.result, q.tables.lexicon),
          },
          content: `<p>${q.result.bref()}</p>${q.result.long()}${make_index(q.name,q.tables.lexicon,q.tables.horaire)}`
        }
      }
    }
  }

  const make_index = (name, lexicon, logs, stop = false) => {
    let html = '';
    let children = [];

    for (let id in lexicon) {
      const term = lexicon[id];
      if (!term.unde() || name != term.unde().toUpperCase()) continue;
      children[children.length] = term;
    }

    for (let id in children) {
      const child = children[id];
      const img = child.scrn() === '' ? '' : `<a onclick='Ø("query").bang("${child.name}")'><img src="img/${child.scrn()}"/></a>`;

      html += `${img}<hs>${child.bref().to_markup()}</hs>
      ${!stop ? make_index(child.name,lexicon,logs,true) : ''}`;
    }

    return children.length > 0 ? `<yu class='container'>${html}</yu>` : '';
  }

  const make_bref = (term, lexicon) => {
    return `<p><a onclick="Ø('query').bang('${term.unde()}')">${term.unde()}</a></p>
    ${make_links(term.links)}
    ${this.make_navi(term, (term.unde() || ''), lexicon)}
    `;
  }

  const make_links = links => {
    let html = '';
    for (let id in links) {
      html += `<a class="p2 mr3 bg-noir blanc f5 lhc" href='${links[id]}' target='_blank'>${id}</a>`;
    }
    return `<div class='links'>${html}</div>`;
  }
}
