function Term (name, dict, unde = 'Home', type = 'none') {
  this.name = name;
  this.dict = dict;
  this.type = type;
  // this.links = dict.LINK ? dict.LINK : [];
  // this.flag = dict.FLAG ? dict.FLAG : [];

  this.parent = null;
  this.children = [];

  this.isPortal = this.type && (this.type.toLowerCase() === 'portal');

  this.bref = dict && dict.BREF ? dict.BREF.toMarkup() : '';
  this.long = new Runic(dict.LONG).html();
  this.unde = unde;
}
