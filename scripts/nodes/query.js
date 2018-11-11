function QueryNode (id) {
  Node.call(this, id);

  this.bang = (target = window.location.hash.substring(1).replace(/[^0-9a-z]/gi, ' ').trim().toLowerCase()) => {
    let noHash = target === '';

    target = target ?
      target.replace(/[^0-9a-z]/gi, ' ').trim().toLowerCase() : 'home';

    window.scrollTo(0, 0);
    this.send(target);

    if (noHash) {
      window.history.replaceState(undefined, undefined, '#' + target);
    } else {
      window.location.hash = target.toURL();
    }
  }
}

function detectBackOrForward (onBack, onForward) {
  const {location, history} = window;
  let hashHistory = [location.hash];
  let historyLength = history.length;

  return function() {
    const hash = location.hash;
    const length = history.length;

    if (hashHistory.length && historyLength === length) {
      if (hashHistory[hashHistory.length - 2] === hash) {
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
  function () {
    // console.log('<<');
    Ø('query').bang()
  },
  function () {
    // console.log('>>');
    Ø('query').bang()
  }
));
