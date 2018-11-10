function PortalTemplate(id, ...params) {
  TemplateNode.call(this, id);

  this.answer = q => {
    const {result, name, tables: {lexicon}} = q;
    const term = result;
    const {unde} = result;
    const children = this.findChildren(name, lexicon);

    return {
      title: q.name.capitalize(),
      view: {
        header: {
          unde: `<p><a onclick="Ø('query').bang('${unde}')">${unde}</a></p>`,
          search: name,
        },
        core: {
          sidebar: {
            bref: `${makeLinks(term.links)}`,
          },
          content: `${result.long}${makePortal(term.name, children)}`
        }
      }
    }
  }

  function makePortal (name, children, logs) {
    let html = '<dl>';

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const {name} = child;
      const title = `<dt><a onclick="Ø('query').bang('${name.toURL()}')">${name.capitalize()}</a></dt>`;

      html += `${title}<dd>${child.bref.toMarkup()}</dd>${!stop ? make_index(name, lexicon, logs, true) : ''}`;
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
