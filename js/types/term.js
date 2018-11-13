function Term (name, dict = {}, unde = 'Home', type = 'none') {
  Object.assign(this, {
    name, dict, type, unde,
    parent: null,
    children: [],
    isPortal: type.toLowerCase() === 'portal',
    bref: dict.BREF ? toMarkup(dict.BREF) : '',
    long: new Runic(dict['$']).html()
  })
}
