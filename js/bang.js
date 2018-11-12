function bang () {
  Ø('query').create(QueryNode);
  Ø('router').create(RouterNode);
  Ø('database').create(DatabaseNode);
  Ø('lexicon').create(IndentalNode, Term);

  Ø('template').create(TemplateNode);
  Ø('home').create(HomeTemplate);
  Ø('page').create(PageTemplate);
  Ø('missing').create(MissingTemplate);
  Ø('portal').create(PortalTemplate);
  Ø('index').create(IndexTemplate);
  Ø('docs').create(DocsTemplate);

  Ø('document').create(DocumentNode);
  Ø('view').create(DomNode);

  Ø('header').create(DomNode, 'header');
  Ø('unde').create(DomNode);
  Ø('search').create(InputNode);
  Ø('core').create(DomNode, 'main');
  Ø('footer').create(DomNode, 'footer',`
    <a href="http://webring.xxiivv.com/#random"><img src="img/rotonde.svg"></a><p><a onclick="Ø('query').bang('josh')">Josh Avanier</a> © Éternité</p>`);

  Ø('router').syphon('database');
  Ø('database').syphon(['lexicon']);

  Ø('template').syphon(['page','portal','index','docs','home']);
  Ø('page').syphon(['missing']);

  Ø('template').connect(['view','document']);
  Ø('header').bind(['unde', 'search']);
  Ø('view').bind(['header','core','footer']);

  Ø('query').connect('router');
  Ø('router').connect('template');

  Ø('query').bang();
}
