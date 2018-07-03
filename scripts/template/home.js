function HomeTemplate(id, rect, ...params) {
  TemplateNode.call(this, id, rect);

  this.glyph = NODE_GLYPHS.template;

  this.answer = q => {
    return {
      title: q.name.capitalize(),
      view: {
        header: {
          photo: q.result.scrn() || 'memex.png',
          search: q.name,
        },
        core: {
          sidebar: {
            bref: `<p>${q.result.bref()}</p>`
          },
          content: ''
        }
      }
    }
  }
}
