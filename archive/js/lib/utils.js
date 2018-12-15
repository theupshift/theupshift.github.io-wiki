function toURL (s) {
  return s.toLowerCase().replace(/ /g, '+').replace(/[^0-9a-z\+]/gi, '').trim();
}

function capitalise (s) {
  return s.substr(0, 1).toUpperCase() + s.slice(1).toLowerCase();
}

function toMarkup (s) {
  let html = s;
  html = html.replace(/{_/g, '<i>').replace(/_}/g, '</i>');
  html = html.replace(/{\*/g, '<b>').replace(/\*}/g, '</b>');

  const parts = html.split('{{');

  function isExternal (target) {
    return target.indexOf('https:') > -1
      || target.indexOf('http:') > -1
      || target.indexOf('dat:') > -1;
  }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.indexOf('}}') < 0) continue;
    const content = part.split('}}')[0];
    if (content.substr(0, 1) === '$') {
      html = html.replace(`{{${content}}}`, Q('operation').request(content.replace('$', '')));
      continue;
    }

    let target = '';
    let name = '';

    if (content.indexOf('|') > -1) {
      const bar = content.split('|');
      target = bar[1];
      name = bar[0];
    } else {
      target = name = content;
    }

    html = html.replace(`{{${content}}}`, isExternal(target) ? `<a href="${target}" target="_blank">${name}</a>` : `<a title="${target}" onclick="Q('q').bang('${target}')">${name}</a>`)
  }

  return html;
}
