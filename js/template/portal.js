function PortalTemplate (id, ...params) {
  Template.call(this, id);

  this.answer = q => {
    const {result: {long, links, unde}, name, tables: {lexicon}} = q;
    const children = this.findChildren(name, lexicon);

    return {
      title: capitalise(name),
      v: {
        u: `<a onclick="Q('q').bang('${unde}')">${unde}</a>`,
        c: `${long}${this.makePortal(name, children)}`,
        s: name
      }
    }
  }

  this.makePortal = (name, children, logs) => {
    let html = '<dl>';
    for (let i = 0; i < children.length; i++) {
      const {name, bref} = children[i];
      const query = `Q('q').bang('${name.toUpperCase()}')`;
      const title = `<dt><a onclick="${query}">${capitalise(name)}</a></dt>`;
      html += `${title}<dd>${toMarkup(bref)}</dd>`;
    }
    return `${html}</dl>`;
  }
}
