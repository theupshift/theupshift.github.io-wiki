function Term (name, dict = {}, unde = 'Home', type = 'none') {
  Object.assign(this, {
    name, type, unde,
    bref: dict['?'] ? toMarkup(dict['?']) : '',
    long: new Runic(dict['$']).html()
  });
}
