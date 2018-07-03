function MissingTemplate(id, rect, ...params) {
  Node.call(this, id, rect);

  this.glyph = NODE_GLYPHS.template;

  this.answer = q => {
    const similar = find_similar(q.name, q.tables.lexicon);

    return {
      title: q.name.capitalize(),
      view: {
        header: {
          photo: 'memex.png',
          search: q.name,
        },
        core: {
          sidebar: {
            bref: '',
          },
          content: `<p>"${q.name.capitalize()}" does not exist within the Memex. Did you mean <a onclick="Ø('query').bang('${similar[0].word}')">${similar[0].word.capitalize()}</a> or <a onclick="Ø('query').bang('${similar[1].word}')">${similar[1].word.capitalize()}</a>?</p>`
        }
      }
    }
  }

  const find_similar = (target, list) => {
    let similar = [];

    for (let key in list) {
      const word = list[key].name;
      similar[similar.length] = {
        word,
        value: similarity(target, word)
      }
    }

    return similar.sort(function(a, b) {
      return a.value - b.value;
    }).reverse();
  }

  const similarity = (a, b) => {
    let val = 0;

    for (let i = 0, l = a.length; i < l; ++i) {
      val += b.indexOf(a.substr(i)) > -1 ? 1 : 0;
    }

    for (let i = 0, l = b.length; i < l; ++i) {
      val += a.indexOf(b.substr(i)) > -1 ? 1 : 0;
    }

    const c = a.split('').sort().join('');
    const d = b.split('').sort().join('');

    for (let i = 0, l = c.length; i < l; ++i) {
      val += d.indexOf(c.substr(i)) > -1 ? 1 : 0;
    }

    for (let i = 0, l = d.length; i < l; ++i) {
      val += c.indexOf(d.substr(i)) > -1 ? 1 : 0;
    }

    return val;
  }
}
