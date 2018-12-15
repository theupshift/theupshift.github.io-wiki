function HomeTemplate(id, ...params) {
  PortalTemplate.call(this, id);

  this.answer = q => {
    const {name, result: {bref}, tables: {lexicon}} = q;
    const children = this.findChildren(name, lexicon);

    return {
      title: capitalise(name),
      v: {
        c: `${q.result.long}${this.makePortal(name, children)}`,
        u: '&mdash;',
        s: name
      }
    }
  }
}
