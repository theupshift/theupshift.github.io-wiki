function HomeTemplate(id, ...params) {
  TemplateNode.call(this, id);

  this.answer = (q) => {
    const {name, result: {bref}} = q;
    const children = this.findChildren(name, q.tables.lexicon);

    return {
      title: name.capitalize(),
      view: {
        header: {
          unde: '&mdash;',
          search: name,
        },
        core: `${q.result.long}${makePortal(children)}`
      }
    }
  }

  function makePortal (children) {
    let html = '<dl>';

    for (let i = 1; i < children.length; i++) {
      const {name, bref} = children[i];
      const url = name.toURL();
      const term = name.capitalize();
      const title = `<a onclick="Ø('query').bang('${url}')">${term}</a>`;
      html += `<dt>${title}</dt><dd>${bref.toMarkup()}</dd>`;
    }

    return `${html}</dl>`;
  }
}
