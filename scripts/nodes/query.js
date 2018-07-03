function QueryNode(id, rect) {
  Node.call(this, id, rect);

  this.glyph = NODE_GLYPHS.entry;
  this.label = 'query';

  this.bang = (target = window.location.hash.substring(1).replace(/[^0-9a-z]/gi, ' ').trim().toLowerCase()) => {
    Ø('view').el.className = 'loading';

    let noHash = (target === '');

    target = target ?
      target.replace(/[^0-9a-z]/gi, ' ').trim().toLowerCase() : 'home';

    this.label = `query:${target}`;

    setTimeout(() => {window.scrollTo(0, 0);}, 250);

    this.send(target);

    if (noHash) {
      window.history.replaceState(undefined, undefined, '#' + target);
    } else {
      window.location.hash = target.to_url();
    }
  }
}

const detectBackOrForward = (onBack, onForward) => {
  let hashHistory = [window.location.hash];
  let historyLength = window.history.length;

  return function() {
    const hash = window.location.hash;
    const length = window.history.length;

    if (hashHistory.length && historyLength == length) {
      if (hashHistory[hashHistory.length - 2] == hash) {
        hashHistory = hashHistory.slice(0, -1);
        onBack();
      } else {
        hashHistory[hashHistory.length] = hash;
        onForward();
      }
    } else {
      hashHistory[hashHistory.length] = hash;
      historyLength = length;
    }
  }
}

window.addEventListener('hashchange', detectBackOrForward(
  function() {
    console.log('back');
    Ø('query').bang()
  },
  function() {
    console.log('forward');
    Ø('query').bang()
  }
));
