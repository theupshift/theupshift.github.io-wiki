function HomeTemplate(id, ...params) {
  TemplateNode.call(this, id);

  this.answer = (q) => {
    const {name, result: {bref}} = q;
    const children = this.findChildren(name, q.tables.lexicon);

    return {
      title: name.capitalize(),
      view: {
        header: {
          unde: '<p>&mdash;</p>',
          search: name,
        },
        core: {
          // sidebar: {
          //   bref: `<p>${bref}</p>`
          // },
          content: `${q.result.long}${makePortal(q.result.name, children)}`
        }
      }
    }
  }

  function makePortal (name, children, logs) {
    let html = '<dl>';

    for (let i = 1; i < children.length; i++) {
      const child = children[i];
      const {name} = child;
      console.log(child)
      const title = `<dt><a onclick="Ø('query').bang('${name.toURL()}')">${name.capitalize()}</a></dt>`;

      html += `${title}<dd>${child.bref.toMarkup()}</dd>${!stop ? make_index(name, lexicon, logs, true) : ''}`;
    }

    return `${html}</dl>`;
  }
}
