function PortalTemplate(id, rect, ...params) {
  TemplateNode.call(this, id, rect);

  this.glyph = NODE_GLYPHS.template;

  this.answer = q => {
    const term = q.result;
    const children = this.find_children(q.name, q.tables.lexicon);

    return {
      title: q.name.capitalize(),
      view: {
        header: {
          photo: q.result.scrn() || 'memex.png',
          search: q.name,
        },
        core: {
          sidebar: {
            bref: make_bref(term, q.tables.lexicon),
          },
          content: `<p>${q.result.bref()}</p>${q.result.long()}${make_portal(term.name, children, q.tables.horaire)}`
        }
      }
    }
  }

  const make_portal = (name, children, logs) => {
    let html = '';

    for (let id in children) {
      const child = children[id];
      const img = child.scrn() === '' ? '' : `<a onclick='Ø("query").bang("${child.name}")'><img src="img/${child.scrn()}"/></a>`;
      const title = `<h2><a onclick="Ø('query').bang('${child.name.to_url()}')">${child.name.capitalize()}</a></h2>`;

      html += `${img}${title}<hs>${child.bref().to_markup()}</hs>${!stop ? make_index(child.name,lexicon,logs,true) : ''}`;
    }

    return html;
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
      html += `<a href="${links[id]}" target="_blank">${id}</a>`;
    }
    return `<div class="links">${html}</div>`;
  }
}
