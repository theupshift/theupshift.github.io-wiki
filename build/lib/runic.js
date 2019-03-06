const RUNES = {
  '&': {tag: 'p'},
  '*': {tag: 'h2'},
  '-': {tag: 'ol', sub: 'li', stash: 1},
  '=': {tag: 'ul', sub: 'li', stash: 1},
  '@': {tag: 'blockquote'},
  '#': {tag: 'code', sub: 'ln', stash: 1},
  '>': {tag: 'ul', sub: 'li', stash: 1}
}

/**
 * Check if link is external
 * @param {string} target
 * @return {boolean} Is external?
 */
function _isExternal (target) {
  return !!~target.indexOf('https:')
    || !!~target.indexOf('http:')
    || !!~target.indexOf('dat:');
}

function _toMarkup (s) {
  let html = s;
  html = html.replace(/{_/g, '<i>').replace(/_}/g, '</i>');
  html = html.replace(/{\*/g, '<b>').replace(/\*}/g, '</b>');

  const parts = html.split('{{');

  for (let i = 0, l = parts.length; i < l; i++) {
    const part = parts[i];
    if (part.indexOf('}}') < 0) continue;
    const content = part.split('}}')[0];
    let target = '', name = '';

    if (content.indexOf('|') > -1) {
      [name, target] = content.split('|');
    } else {
      target = name = content;
    }

    const link = _isExternal(target)
      ? `<a href="${target}"target="_blank">${name}</a>`
      : `<a href="./${target.toUrl()}.html">${name}</a>`;

    html = html.replace(`{{${content}}}`, link);
  }

  return html;
}

module.exports = function (raw) {
  this.raw = raw;
  this.stash = {
    rune: '',
    all: [],

    add (rune, item) {
      this.rune = rune;
      this.all[this.all.length] = {rune, item};
    },

    isPop (rune) {
      return this.all.length > 0 && rune.tag !== this.rune.tag;
    },

    length () {
      return this.all.length;
    },

    pop () {
      const copy = this.all;
      this.all = [];
      return copy;
    }
  }

  this.parse = _ => {
    const raw = this.raw;
    if (!raw) return '';

    let html = '';
    let lines = raw;

    for (let i = 0, l = lines.length; i < l; i++) {
      let line = lines[i];
      const char = line[0];
      const rune = RUNES[char];
      const content = line.substr(2);

      line = _toMarkup(content);
      if (!line || line.trim() === '') continue;

      switch (char) {
        case '%': html += this.media(content); continue;
        case '@': html += this.quote(content); continue;
        case '>': this.stash.add(rune, this.termItem(line)); continue;
        default: break;
      }

      if (!rune) {
        console.warn(`Unknown rune: ${char} : ${line}`);
        continue;
      }

      if (this.stash.isPop(rune)) html += this.renderStash();

      if (rune.stash) {
        this.stash.add(rune, line);
        continue;
      }

      html += this.render(line, rune);
    }

    return this.stash.length() > 0 ? html += this.renderStash() : html;
  }

  this.renderStash = _ => {
    let {tag} = this.stash.rune;
    let stash = this.stash.pop();
    let html = '';

    for (let i = 0, l = stash.length; i < l; i++) {
      const {rune: {sub}, item} = stash[i];
      html += `<${sub}>${item}`;
    }

    return `<${tag}>${html}</${tag}>`;
  }

  this.render = (line = '', rune = null) => {
    const {tag} = rune;
    return rune ? (tag ? `<${tag}>${line}</${tag}>` : line) : '';
  }

  this.termItem = content => {
    let [term, def] = content.split(' : ');
    return `<b>${term.trim()}</b>: ${def.trim()}`;
  }

  this.media = content => {
    let html = '';
    const gallery = content.split(' ');
    const png = x => !~x.indexOf('.') ? `${x}.png` : x;
    for (let i = 0, l = gallery.length; i < l; i++) {
      html += `<img src="m/${png(gallery[i])}">`;
    }
    return html;
  }

  this.quote = content => {
    const [text, author, source, link] = content.split(' | ');
    const attr = source
      ? link
        ? `${author}, <a href="${link}"target="_blank">${source}</a>`
        : `${author}, ${source}`
      : author;
    return `<blockquote><p class="q">${text}${author ? `<p class="a">&mdash; ${attr}` : ''}</blockquote>`
  }

  this.html = _ => this.parse();
}
