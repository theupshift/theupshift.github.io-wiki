function toURL (s) {
  return s.toLowerCase().replace(/ /g, '+').replace(/[^0-9a-z\+]/gi, '').trim();
}

function capitalise (s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function toMarkup (s) {
  let html = s;
  html = html.replace(/{_/g, '<i>').replace(/_}/g, '</i>');
  html = html.replace(/{\*/g, '<b>').replace(/\*}/g, '</b>');
  html = html.replace(/{\#/g, '<code>').replace(/\#}/g, '</code>');

  const parts = html.split('{{');

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.indexOf('}}') < 0) continue;
    const content = part.split('}}')[0];
    if (content.substr(0, 1) === '$') {
      html = html.replace(`{{${content}}}`, Ø('operation').request(content.replace('$', '')));
      continue;
    }

    let target, name;
    if (content.indexOf('|') > -1) {
      const bar = content.split('|');
      target = bar[1];
      name = bar[0];
    } else {
      target = name = content;
    }

    const isHTTPS = target.indexOf('https:') > -1;
    const isHTTP = target.indexOf('http:') > -1;
    const isDAT = target.indexOf('dat:') > -1
    const external = isHTTPS || isHTTP || isDAT;

    html = html.replace(`{{${content}}}`, external ? `<a href='${target}' class='external' target='_blank'>${name}</a>` : `<a class='local' title='${target}' onclick="Ø('query').bang('${target}')">${name}</a>`)
  }

  return html;
}
