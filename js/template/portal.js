function PortalTemplate(id, ...params) {
  TemplateNode.call(this, id);

  this.answer = (q) => {
    const {result: {long, links, unde}, name, tables: {lexicon}} = q;
    const children = this.findChildren(name, lexicon);

    return {
      title: q.name.capitalize(),
      view: {
        core: `${long}${makePortal(name, children)}`
        unde: `<p><a onclick="Ø('query').bang('${unde}')">${unde}</a></p>`,
        search: name,
      }
    }
  }

  function makePortal (name, children, logs) {
    let html = '<dl>';

    for (let i = 0; i < children.length; i++) {
      const {name, bref} = children[i];
      const title = `<dt><a onclick="Ø('query').bang('${name.toURL()}')">${name.capitalize()}</a></dt>`;

      html += `${title}<dd>${bref.toMarkup()}</dd>${!stop ? make_index(name, lexicon, logs, true) : ''}`;
    }

    return `${html}</dl>`;
  }

  function makeLinks (links) {
    let html = '';
    for (let id in links) {
      html += `<a href="${links[id]}" target="_blank">${id}</a>`;
    }
    return `<div class="links">${html}</div>`;
  }
}
