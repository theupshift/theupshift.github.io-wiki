const RUNES = {
  '&': {tag: 'p'},
  '*': {tag: 'h2'},
  '-': {tag: 'ol', sub: 'li', stash: 1},
  '=': {tag: 'ul', sub: 'li', stash: 1},
  '@': {tag: 'blockquote'},
  '#': {tag: 'code', sub: 'ln', stash: 1}
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

    const link = isExternal(target)
      ? `<a href="${target}" target="_blank">${name}</a>`
      : `<a href="./${target.toUrl()}.html">${name}</a>`;

    html = html.replace(`{{${content}}}`, link);
  }

  return html;
}

module.exports = function (raw) {
  this.raw = raw
  this.stash = {
    rune: '',
    all: [],

    add (rune, item) {
      this.rune = this.copy(rune);
      this.all[this.all.length] = {rune, item};
    },

    pop () {
      const copy = this.copy(this.all);
      this.all = [];
      return copy;
    },

    isPop (rune) {
      return this.all.length > 0 && rune.tag !== this.rune.tag;
    },

    length () {
      return this.all.length;
    },

    copy (data) {
      return JSON.parse(JSON.stringify(data));
    }
  }

  this.parse = (raw = this.raw) => {
    if (!raw) return '';

    let html = '';
    let lines = raw;

    for (let i = 0, l = lines.length; i < l; i++) {
      let line = lines[i];
      const char = line.substr(0, 1).trim();
      const rune = RUNES[char];
      const trail = line.substr(1, 1);
      const content = line.substr(2);

      switch (char) {
        case '%': html += this.media(content); continue;
        case '@': html += this.quote(content); continue;
        default: break;
      }

      line = toMarkup(line.substr(2));
      if (!line || line.trim() === '') continue;

      if (!rune) {
        console.warn(`Unknown rune:${char} : ${line}`);
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

  this.renderStash = () => {
    let {klass, tag} = this.stash.rune;
    let stash = this.stash.pop();
    let html = '';

    for (let i = 0, l = stash.length; i < l; i++) {
      const st = stash[i];
      const {sub, wrap} = st.rune;
      const line = st.item;

      html += wrap ?
        `<${sub}><${wrap}>${line.replace(/\|/g,`</${wrap}><${wrap}>`).trim()}</${wrap}>` :
        `<${sub}>${line}`;
    }

    return `<${tag}>${html}</${tag}>`;
  }

  this.render = (line = '', rune = null) => {
    const {tag} = rune;
    return rune ? (tag ? `<${tag}>${line}</${tag}>` : line) : '';
  }

  this.media = (content) => {
    let html = '';
    const gallery = content.split(' ');
    const png = x => !~x.indexOf('.') ? `${x}.png` : x;
    for (let i = 0, l = gallery.length; i < l; i++) {
      html += `<img src="m/${png(gallery[i].trim())}">`;
    }
    return html;
  }

  this.quote = (content) => {
    const [text, author, source, link] = content.split(' | ');
    let attr = '';
    if (source) {
      attr = link ?
        `${author}, <a href="${link}"><i>${source}</i></a>` :
        `${author}, <i>${source}</i>`;
    } else {
      attr = author;
    }
    return `<blockquote><p class="q">&ldquo;${text}&rdquo;${author ? `<p class="a">&mdash; ${attr}` : ''}</blockquote>`
  }

  this.html = () => this.parse(raw);
}
