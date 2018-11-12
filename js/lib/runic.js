function Rune (opts) {
  this.glyph = opts.glyph;
  this.tag = opts.tag;
  this.klass = opts.klass || '';
  this.sub = opts.sub;
  this.stash = opts.stash;
}

function Runic (raw) {
  this.raw = raw;

  this.runes = {
    '&': new Rune({glyph: '&', tag: 'p'}),
    '~': new Rune({
      glyph: '~', tag: 'ul', sub: 'li', klass: 'parent', stash: true
    }),
    '-': new Rune({glyph: '-', tag: 'ol', sub: 'li', stash: true}),
    '=': new Rune({glyph: '=', tag: 'list', sub: 'li', stash: true}),
    '!': new Rune({
      glyph: '!',
      tag: 'table',
      sub: 'tr',
      wrap: 'th',
      klass: 'outline',
      stash: true
    }),
    '|': new Rune({
      glyph: '|',
      tag: 'table',
      sub: 'tr',
      wrap: 'td',
      klass: 'outline',
      stash: true
    }),
    '#': new Rune({glyph: '#', tag: 'code', sub: 'ln', stash: true}),
    '%': new Rune({glyph: '%'}),
    '?': new Rune({glyph: '?', tag: 'note'}),
    ':': new Rune({glyph: ':', tag: 'info'}),
    '*': new Rune({glyph: '*', tag: 'h2'}),
    '+': new Rune({glyph: '+'}),
    '>': new Rune({glyph: '>'}),
    '$': new Rune({glyph: '>'}),
    '@': new Rune({glyph: '@', tag: 'blockquote'})
  }

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
    let lines = !Array.isArray(raw) ? raw.split('\n') : raw;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const char = line.substr(0, 1).trim().toString();
      const rune = this.runes[char];
      const trail = line.substr(1, 1);

      switch (char) {
        case '$':
          html += `<p>${Ø('operation').request(line.substr(2)).toMarkup()}</p>`;
          continue;
          break;
        case '%':
          html += this.media(line.substr(2));
          continue;
          break;
        case '|':
          html += this.table(line.substr(2));
          continue;
          break;
        case '@':
          html += this.quote(line.substr(2));
          continue;
          break;
        default:
          break;
      }

      line = line.substr(2).toMarkup();
      if (!line || line.trim() === '') continue;

      if (!rune) console.log(`Unknown rune:${char} : ${line}`);

      if (trail !== ' ') {
        console.warn('Runic', `Non-rune[${trail}] at: ${id} (${line})`);
        continue;
      }

      if (this.stash.isPop(rune)) html += this.render_stash();

      if (rune.stash === true) {
        this.stash.add(rune, line);
        continue;
      }

      html += this.render(line, rune);
    }

    if (this.stash.length() > 0) html += this.render_stash();

    return html;
  }

  this.render_stash = () => {
    let {klass, tag} = this.stash.rune;
    let stash = this.stash.pop();
    let html = '';

    for (let i = 0; i < stash.length; i++) {
      const st = stash[i];
      const {sub, wrap} = st.rune;
      const line = st.item;

      html += wrap ? `<${sub}><${wrap}>${line.replace(/\|/g,`</${wrap}><${wrap}>`).trim()}</${wrap}></${sub}>` :
        `<${sub}>${line}</${sub}>`;
    }

    return `<${tag} class='${klass}'>${html}</${tag}>`;
  }

  this.render = (line = '', rune = null) => {
    if (rune && rune.tag === 'img') return `<img src="img/${line}"/>`;

    return rune ?
      (rune.tag ?
        `<${rune.tag} class='${rune.klass}'>${line}</${rune.tag}>` : line
      ) : '';
  }

  this.table = (content) => {
    return `<td>${content.trim().replace(/ \| /g, '</td><td>')}</td>`;
  }

  this.media = (val) => `<img src="img/${val}"/>`;

  this.quote = (content) => {
    const [text, author, source, link] = content.split(' | ');
    const attrib = link ? `${author}, <a href="${link}">${source}</a>` : author;

    return `<blockquote><p class="text">${text}</p>${author ? `<p class="attrib">${attrib}</p>` : ''}</blockquote>`
  }

  this.html = () => this.parse(raw);
  this.toString = () => this.html();
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.prototype.toURL = function () {
  return this.toLowerCase().replace(/ /g, '+').replace(/[^0-9a-z\+]/gi, '').trim();
}

String.prototype.toPath = function () {
  return this.toLowerCase().replace(/ /g, '.').replace(/[^0-9a-z\.]/gi, '').trim();
}

String.prototype.toMarkup = function () {
  html = this;
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
