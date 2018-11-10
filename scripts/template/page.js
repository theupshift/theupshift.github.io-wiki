function PageTemplate(id, rect, ...params) {
  TemplateNode.call(this, id, rect);

  this.answer =  q => {
    if (!q.result) return this.signal('missing').answer(q);
    const {bref, links, long, unde} = q.result;

    return {
      title: q.name.capitalize(),
      view: {
        header: {
          unde: `<p><a onclick="Ø('query').bang('${unde}')">${unde}</a></p>`,
          search: q.name,
        },
        core: {
          sidebar: {
            bref: `${makeLinks(links)} ${this.makeNavi(q.result, (unde || ''), q.tables.lexicon)}`
          },
          content: this.signal(q.name) ?
            this.signal(q.name).answer(q) :
            long,
        },
        style: this.signal(q.name) ? this.signal(q.name).style(q) : ''
      }
    }
  }

  function makeLinks (links) {
    let html = '';
    for (let id in links) {
      html += `<a href='${links[id]}' target='_blank'>${id.capitalize()}</a>`;
    }
    return `<div class='links'>${html}</div>`;
  }
}
