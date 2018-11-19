function StatusTemplate (id, ...params) {
  TemplateNode.call(this, id);

  this.answer = (q) => {
    const {name, result: {unde, long}, tables: {lexicon, horaire}} = q;

    return {
      title: capitalise(name),
      v: {
        u: `<a onclick="Q('query').bang('${unde}')">${unde}</a>`,
        s: name,
        c: `${long}${this.makeIndex(lexicon)}`
      }
    }
  }

  this.makeIndex = (lexicon) => {
    console.log(lexicon);
    let html = '<table><thead><tr><th class="ac">~</th><th>Page</th><th class="ac">Image(s)</th><th class="ac">Link(s)</th><th class="ar">Word Count</th></tr></thead><tbody>';
    const wc = wordCount(lexicon);

    const defs = {
      'page': '-',
      'home': '&#9650;',
      'portal': '@',
      'index': '+',
      'status': '~'
    }

    let i = 0;
    for (let key in lexicon) {
      const {name, long, type} = lexicon[key];
      const hasImage = long.indexOf('<img') > -1;
      const hasLink = long.indexOf('<a') > -1;

      html += `
        <tr><td class="ac">${defs[type]}</td>
        <td><a onclick="Q('query').bang('${name}')">${capitalise(name)}</a></td>
        <td class="ac">${hasImage ? '&middot;' : ''}</td>
        <td class="ac">${hasLink ? '&middot;' : ''}</td>
        <td class="ar">${wc[i++]}</td></tr>
      `;
    }

    return `${html}</tbody></table>`;
  }

  function wordCount (lexicon) {
    let wc = [];
    for (key in lexicon) {
      const {name, long} = lexicon[key];
      if (long.length === 0) {
        wc[wc.length] = 0;
        continue;
      }
      wc[wc.length] = long.split(' ').length;
    }
    return wc;
  }
}
