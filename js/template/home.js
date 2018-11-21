function HomeTemplate(id, ...params) {
  Template.call(this, id);

  this.answer = q => {
    const {name, result: {bref}, tables: {lexicon}} = q;
    const children = this.findChildren(name, lexicon);

    return {
      title: capitalise(name),
      v: {
        c: `${q.result.long}${makePortal(children)}`,
        u: '&mdash;',
        s: name
      }
    }
  }

  function makePortal (children) {
    let html = '<dl>';

    for (let i = 1; i < children.length; i++) {
      const {name, bref} = children[i];
      const url = toURL(name);
      const term = capitalise(name);
      const title = `<a onclick="Q('q').bang('${url}')">${term}</a>`;
      html += `<dt>${title}</dt><dd>${toMarkup(bref)}</dd>`;
    }

    return `${html}</dl>`;
  }
}
