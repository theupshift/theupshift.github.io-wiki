function Term (name, dict) {
  this.name = name;
  this.dict = dict;
  this.type = dict.TYPE ? dict.TYPE.toLowerCase() : 'none';
  this.links = dict.LINK ? dict.LINK : [];
  this.flag = dict.FLAG ? dict.FLAG : [];

  // Filled with Ø('map')
  this.parent = null;
  this.children = [];

  this.isPortal = this.type && (this.type.toLowerCase() === 'portal');

  // this.scrn = () => this.dict.SCRN || '';
  // this.stat = () => this.dict.STAT || '';

  this.bref = dict && dict.BREF ? dict.BREF.toMarkup() : '';
  this.long = new Runic(dict.LONG).html();
  this.unde = dict.UNDE ? dict.UNDE : 'Home';
}
