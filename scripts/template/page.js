function PageTemplate(id, rect, ...params) {
  TemplateNode.call(this, id, rect);

  this.glyph = NODE_GLYPHS.template

  this.answer =  q => {
    if (!q.result) return this.signal('missing').answer(q);

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
          content: this.signal(q.name) ?
            this.signal(q.name).answer(q) :
            `<p>${q.result.bref()}</p>${q.result.long()}`,
        },
        style: this.signal(q.name) ? this.signal(q.name).style(q) : ''
      }
    }
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
      html += `<a href='${links[id]}' target='_blank'>${id.capitalize()}</a>`;
    }
    return `<div class='links'>${html}</div>`;
  }
}
