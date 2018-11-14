function Term (name, dict = {}, unde = 'Home', type = 'none') {
  Object.assign(this, {
    name, type, unde,
    bref: dict.BREF ? toMarkup(dict.BREF) : '',
    long: new Runic(dict['$']).html()
  });
}
