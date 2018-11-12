function PageTemplate(id, ...params) {
  TemplateNode.call(this, id);

  this.answer = (q) => {
    if (!q.result) return this.signal('missing').answer(q);
    const {name, result: {bref, links, long, unde}} = q;

    return {
      title: name.capitalize(),
      view: {
        header: {
          unde: `<a onclick="Ø('query').bang('${unde}')">${unde}</a>`,
          search: name,
        },
        core: this.signal(name) ? this.signal(name).answer(q) : long
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
