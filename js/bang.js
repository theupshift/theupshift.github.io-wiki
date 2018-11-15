function bang () {
  Q('query').create(QueryNode);
  Q('router').create(RouterNode);
  Q('database').create(DatabaseNode);
  Q('lexicon').create(IndentalNode, Term);

  Q('template').create(TemplateNode);
  Q('home').create(HomeTemplate);
  Q('page').create(PageTemplate);
  Q('missing').create(MissingTemplate);
  Q('portal').create(PortalTemplate);
  Q('index').create(IndexTemplate);
  Q('docs').create(DocsTemplate);

  Q('document').create(DocumentNode);
  Q('v').create(DomNode);

  Q('u').create(DomNode, 'p');
  Q('s').create(InputNode);
  Q('c').create(DomNode, 'main');
  Q('f').create(DomNode, 'footer',`
    <a href="http://webring.xxiivv.com/#random"><img id="w" src="athenaeum.codex/img/rotonde.svg"></a><p><a onclick="Q('query').bang('josh')">Josh Avanier</a> © Éternité</p>`);

  Q('router').syphon('database');
  Q('database').syphon(['lexicon']);
  Q('template').syphon(['page','portal','index','docs','home']);
  Q('page').syphon(['missing']);

  Q('template').connect(['v','document']);
  Q('v').bind(['u','s','c','f']);

  Q('query').connect('router');
  Q('router').connect('template');

  Q('query').bang();
}
