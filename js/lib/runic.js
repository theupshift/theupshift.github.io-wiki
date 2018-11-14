function Rune (opts) {
  Object.assign(this, {
    tag: opts.tag,
    klass: opts.klass || '',
    sub: opts.sub,
    stash: opts.stash,
    wrap: opts.wrap
  });
}

const RUNES = {
  '&': new Rune({tag: 'p'}),
  '*': new Rune({tag: 'h2'}),
  '-': new Rune({tag: 'ol', sub: 'li', stash: true}),
  '=': new Rune({tag: 'ul', sub: 'li', stash: true}),
  '@': new Rune({tag: 'blockquote'}),
  '#': new Rune({tag: 'code', sub: 'ln', stash: true}),
  '!': new Rune({tag: 'table', sub: 'tr', wrap: 'th', stash: true}),
  '+': new Rune({tag: 'table', sub: 'tr', wrap: 'td', stash: true})
}

function Runic (raw) {
  this.raw = raw;
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
      const char = line.substr(0, 1).trim();
      const rune = RUNES[char];
      const trail = line.substr(1, 1);
      const content = line.substr(2);

      switch (char) {
        case '$':
          html += `<p>${Ø('operation').request(content).toMarkup()}</p>`;
          continue;
        case '%': html += this.media(content); continue;
        case '|': html += this.table(content); continue;
        case '@': html += this.quote(content); continue;
        default:
          break;
      }

      line = toMarkup(line.substr(2));
      if (!line || line.trim() === '') continue;

      if (!rune) console.warn(`Unknown rune:${char} : ${line}`);

      if (trail !== ' ') {
        console.warn('Runic', `Non-rune[${trail}] at: ${id} (${line})`);
        continue;
      }

      if (this.stash.isPop(rune)) html += this.renderStash();

      if (rune.stash === true) {
        this.stash.add(rune, line);
        continue;
      }

      html += this.render(line, rune);
    }

    if (this.stash.length() > 0) html += this.renderStash();

    return html;
  }

  this.renderStash = () => {
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

    return `<${tag}>${html}</${tag}>`;
  }

  this.render = (line = '', rune = null) => {
    if (rune && rune.tag === 'img') return `<img src="img/${line}"/>`;
    return rune ? (rune.tag ?
      `<${rune.tag}>${line}</${rune.tag}>` : line
    ) : '';
  }

  this.media = (content) => {
    if (content.indexOf(',') > -1) {
      let html = '';
      const gallery = content.split(',');
      for (let i = 0; i < gallery.length; i++) {
        html += `<img src="img/${gallery[i].trim()}"/>`;
      }
      return html;
    }
    return `<img src="img/${content}"/>`
  }

  this.table = (content) => {
    return `<td>${content.trim().replace(/ \| /g, '</td><td>')}</td>`;
  }

  this.quote = (content) => {
    const [text, author, source, link] = content.split(' | ');
    const attrib = link ? `${author}, <a href="${link}">${source}</a>` : author;

    return `<blockquote><p class="q">${text}</p>${author ? `<p class="a">${attrib}</p>` : ''}</blockquote>`
  }

  this.html = () => this.parse(raw);
  this.toString = () => this.html();
}
