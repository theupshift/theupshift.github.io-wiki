function MissingTemplate (id, ...params) {
  Template.call(this, id);

  this.answer = (q, lexicon = riven.lexicon.cache) => {
    const {name} = q;
    const sim = this.findSimilar(name, lexicon);
    const w1 = sim[0].word;
    const w2 = sim[1].word;

    return {
      title: '404',
      v: {
        s: name,
        u: `<a onclick="Q('q').bang('Home')">Home</a>`,
        c: `<p>The page "${capitalise(name)}" does not exist within the Athenaeum. Were you looking for <a onclick="Q('q').bang('${w1}')">${capitalise(w1)}</a> or <a onclick="Q('q').bang('${w2}')">${capitalise(w2)}</a>?`
      }
    }
  }

  this.findSimilar = (target, list) => {
    let similar = [];
    for (let key in list) {
      const word = list[key].name;
      similar[similar.length] = {
        word, value: this.similarity(target, word)
      }
    }

    return similar.sort((a, b) => a.value - b.value).reverse();
  }

  this.similarity = (a, b) => {
    let v = 0;
    for (let i = 0; i < a.length; i++) v += +(b.indexOf(a.substr(i)) > -1);
    for (let i = 0; i < b.length; i++) v += +(a.indexOf(b.substr(i)) > -1);
    const c = a.split('').sort().join('');
    const d = b.split('').sort().join('');
    for (let i = 0; i < c.length; i++) v += +(d.indexOf(c.substr(i)) > -1);
    for (let i = 0; i < d.length; i++) v += +(c.indexOf(d.substr(i)) > -1);
    return v;
  }
}
