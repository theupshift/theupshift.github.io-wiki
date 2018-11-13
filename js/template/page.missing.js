function MissingTemplate (id, ...params) {
  Node.call(this, id);

  this.answer = (q) => {
    const {name, tables: {lexicon}} = q;
    const similar = find_similar(name, lexicon);
    const w1 = similar[0].word;
    const w2 = similar[1].word;
    const title = name.capitalize();

    return {
      title,
      view: {
        core: `<p>The page "${title}" does not exist within the Athenaeum. Were you looking for <a onclick="Ø('query').bang('${w1}')">${w1.capitalize()}</a> or <a onclick="Ø('query').bang('${w2}')">${w2.capitalize()}</a>?</p>`
        unde: `<a onclick="Ø('query').bang('Home')">Home</a>`,
        search: name,
      }
    }
  }

  function find_similar (target, list) {
    let similar = [];

    for (let key in list) {
      const word = list[key].name;
      similar[similar.length] = {
        word, value: similarity(target, word)
      }
    }

    return similar.sort(function(a, b) {
      return a.value - b.value;
    }).reverse();
  }

  function similarity (a, b) {
    let val = 0;

    for (let i = 0; i < a.length; ++i) {
      val += +(b.indexOf(a.substr(i)) > -1);
    }

    for (let i = 0; i < b.length; ++i) {
      val += +(a.indexOf(b.substr(i)) > -1);
    }

    const c = a.split('').sort().join('');
    const d = b.split('').sort().join('');

    for (let i = 0; i < c.length; ++i) {
      val += +(d.indexOf(c.substr(i)) > -1);
    }

    for (let i = 0; i < d.length; ++i) {
      val += +(c.indexOf(d.substr(i)) > -1);
    }

    return val;
  }
}
