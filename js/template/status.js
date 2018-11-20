function StatusTemplate (id, ...params) {
  TemplateNode.call(this, id);

  this.answer = (q) => {
    const {name, result: {unde, long}, tables: {lexicon, horaire}} = q;

    return {
      title: 'Status',
      v: {
        u: `<a onclick="Q('query').bang('HOME')">Home</a>`,
        c: `${long}${this.makeIndex(lexicon)}`,
        s: 'Status'
      }
    }
  }

  this.makeIndex = (lexicon) => {
    const {home, index, page, portal, status} = organiseByType(lexicon);
    return this.makeIndexTable(index)
      + this.makePortalTable(portal)
      + this.makePageTable(page);
  }

  this.makeIndexTable = (index) => {
    let html = `
      <table><thead><tr>
      <th>Index</th><th class="ac">IN</th><th class="ac">MD</th><th class="ar">WC</th>
      <th class="ar">CI</th></tr></thead><tbody>`;
    let wc = wordCount(index);
    for (let i = 0; i < index.length; i++) {
      const {name, long, type} = index[i];
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const CI = completenessIndex(x, y);
      const indx = calcIndex(CI, 2);

      html += `
        <tr><td><a onclick="Q('query').bang('${name}')">${capitalise(name)}</a></td>
        <td class="ac">${x ? '&#9899;' : '-'}</td>
        <td class="ac">${y ? '&#9899;' : '-'}</td>
        <td class="ar">${wc[i]}</td>
        <td class="ar">${indx.toFixed(2)}</td></tr>
      `;
    }
    return `${html}</tbody></table>`;
  }

  this.makePortalTable = (portal) => {
    let html = `
      <table><thead><tr>
      <th>Portal</th><th class="ac">IN</th><th class="ac">MD</th><th class="ar">WC</th>
      <th class="ar">CI</th></tr></thead><tbody>`;
    let wc = wordCount(portal);
    for (let i = 0; i < portal.length; i++) {
      const {name, long, type} = portal[i];
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const CI = completenessIndex(x, y);
      const indx = calcIndex(CI, 2);

      html += `
        <tr><td><a onclick="Q('query').bang('${name}')">${capitalise(name)}</a></td>
        <td class="ac">${x ? '&#9899;' : '-'}</td>
        <td class="ac">${y ? '&#9899;' : '-'}</td>
        <td class="ar">${wc[i]}</td>
        <td class="ar">${indx.toFixed(2)}</td></tr>
      `;
    }
    return `${html}</tbody></table>`;
  }

  this.makePageTable = (page) => {
    let html = makeTableHeader();
    let wc = wordCount(page);
    for (let i = 0; i < page.length; i++) {
      const {name, long, type} = page[i];
      const x = long.length > 0;
      const y = long.indexOf('<img') > -1;
      const z = long.indexOf('<a') > -1;
      const CI = completenessIndex(x, y, z);
      const indx = calcIndex(CI, 3);

      html += `
        <tr><td><a onclick="Q('query').bang('${name}')">${capitalise(name)}</a></td>
        <td class="ac">${x ? '&#9899;' : '-'}</td>
        <td class="ac">${y ? '&#9899;' : '-'}</td>
        <td class="ac">${z ? '&#9899;' : '-'}</td>
        <td class="ar">${wc[i]}</td>
        <td class="ar">${indx.toFixed(2)}</td></tr>
      `;
    }
    return `${html}</tbody></table>`;
  }

  function makeTableHeader () {
    return `
      <table><thead><tr><th>Page</th><th class="ac">IN</th>
      <th class="ac">MD</th><th class="ac">LN</th>
      <th class="ar">WC</th><th class="ar">CI</th>
      </tr></thead><tbody>`;
  }

  function organiseByType (lexicon) {
    const types = {};
    for (let key in lexicon) {
      const {type, name} = lexicon[key];
      if (types[type] === undefined) types[type] = [];
      types[type][types[type].length] = lexicon[key];
    }
    return types;
  }

  function completenessIndex (...points) {
    let index = 0;
    for (let i = 0; i < points.length; i++) {
      if (points[i]) index++;
    }
    return index;
  }

  function calcIndex (CI, maxPoints) {
    return CI === 0 ? 0 : CI / maxPoints;
  }

  function wordCount (lexicon) {
    let wc = [];
    for (key in lexicon) {
      const {name, long} = lexicon[key];
      wc[wc.length] = long.length === 0
        ? 0 : long.split(' ').length;
    }
    return wc;
  }
}
