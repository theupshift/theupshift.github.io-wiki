function graph() {
  Ø('query').create({x:2,y:4},QueryNode);

  Ø('model').mesh({x:6,y:0},[
    Ø('router').create({x:4,y:2},RouterNode),
    Ø('database').create({x:4,y:6},DatabaseNode),
    Ø('lexicon').create({x:2,y:11},IndentalNode,Term),
  ]);

  Ø('assoc').mesh({x:16,y:0},[
    Ø('template').create({x:11,y:2},TemplateNode),
      Ø('home').create({x:20,y:11},HomeTemplate),
    Ø('page').create({x:5,y:11},PageTemplate),
      Ø('missing').create({x:2,y:16},MissingTemplate),
    Ø('portal').create({x:8,y:11},PortalTemplate),
    Ø('index').create({x:14,y:11},IndexTemplate),
    Ø('docs').create({x:11,y:11},DocsTemplate),
  ]);

  Ø('client').mesh({x:40,y:0},[
    Ø('document').create({x:2,y:2},DocumentNode),
    Ø('view').create({x:2,y:6},DomNode),
    Ø('style').create({x:10,y:11},DomNode,'style'),
    Ø('header').create({x:2,y:11},DomNode),
      Ø('photo').create({x:2,y:16},DomPhotoNode,'photo'),
      Ø('logo').create({x:10,y:16},DomNode,'h1','<a onclick="Ø(\'query\').bang(\'home\')">Memex</a>'),
      Ø('menu').create({x:6,y:16},DomNode),
        Ø('search').create({x:2,y:21},InputNode),
    Ø('core').create({x:18,y:11},DomNode),
      Ø('sidebar').create({x:22,y:16},DomNode),
        Ø('bref').create({x:18,y:21},DomNode),
      Ø('content').create({x:18,y:16},DomNode),


    Ø('footer').create({x:6,y:11},DomNode,'yu',`
      <a href="http://webring.xxiivv.com/#random" class="icon rotonde"></a>
    <a onclick="Ø('query').bang('josh')">Josh Avanier</a> © Éternité`),
  ]);

  // Operation
  Ø('runic').mesh({x:6,y:23},[
    Ø('operation').create({x:5,y:2},OperationNode),
  ]);

  // Model
  Ø('router').syphon('database');
  Ø('database').syphon(["lexicon","horaire"]);

  // Assoc
  Ø('template').syphon(["page","portal","index","docs","home"]);
  Ø('docs').syphon(["knowledge"]);
  Ø('page').syphon(["missing"]);

  Ø('template').connect(["view","document"]);
  Ø('header').bind(["logo", "search", "photo"]);
  Ø('view').bind(["header","core","footer","style"]);
  Ø('core').bind(["sidebar","content","navi"]);
  Ø('sidebar').bind(["bref"]);

  Ø('query').connect('router');
  Ø('router').connect('template');

  Ø('query').bang();
}
