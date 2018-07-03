function Runic(raw) {
  this.raw = raw;

  this.runes = {
    '&':{glyph:'&',tag:'p',class:''},
    '~':{glyph:'~',tag:'list',sub:'ln',class:'parent',stash:true},
    '-':{glyph:'-',tag:'list',sub:'ln',class:'',stash:true},
    '=':{glyph:'=',tag:'list',sub:'ln',class:'mini',stash:true},
    '!':{glyph:'!',tag:'table',sub:'tr',wrap:'th',class:'outline',stash:true},
    '|':{glyph:'|',tag:'table',sub:'tr',wrap:'td',class:'outline',stash:true},
    '#':{glyph:'#',tag:'code',sub:'ln',class:'',stash:true},
    '%':{glyph:'%'},
    '?':{glyph:'?',tag:'note',class:''},
    ':':{glyph:':',tag:'info',class:''},
    '*':{glyph:'*',tag:'h2',class:''},
    '+':{glyph:'+',tag:'hs',class:''},
    '>':{glyph:'>',tag:'',class:''},
    '$':{glyph:'>',tag:'',class:''},
    '@':{glyph:'@',tag:'quote',class:''}
  }

  this.stash = {
    rune: '',
    all: [],

    add(rune, item) {
      this.rune = this.copy(rune);
      this.all[this.all.length] = {
        rune: rune,
        item: item
      };
    },

    pop() {
      const copy = this.copy(this.all);
      this.all = [];
      return copy;
    },

    is_pop(rune) {
      return this.all.length > 0 && rune.tag != this.rune.tag;
    },

    length() {
      return this.all.length;
    },

    copy(data) {
      return JSON.parse(JSON.stringify(data));
    }
  }

  this.parse = (raw = this.raw) => {
    if (!raw) return '';

    let html = '';
    let lines = raw;
    lines = !Array.isArray(raw) ? raw.split('\n') : raw;

    for (let id in lines) {
      const char = lines[id].substr(0, 1).trim().toString();
      const rune = this.runes[char];
      const trail = lines[id].substr(1, 1);

      switch (char) {
        case '$':
          html += '<p>' + Ø('operation').request(lines[id].substr(2)).to_markup() + '</p>';
          continue;
          break;
        case '%':
          html += this.media(lines[id].substr(2));
          continue;
          break;
        case '@':
          html += this.quote(lines[id].substr(2));
          continue;
          break;
        default:
          break;
      }

      const line = lines[id].substr(2).to_markup();
      if (!line || line.trim() === '') continue;

      if (!rune) console.log(`Unknown rune:${char} : ${line}`);

      if (trail != ' ') {
        console.warn('Runic', 'Non-rune[' + trail + '] at:' + id + '(' + line + ')');
        continue;
      }

      if (this.stash.is_pop(rune)) html += this.render_stash();

      if (rune.stash === true) {
        this.stash.add(rune, line);
        continue;
      }

      html += this.render(line, rune);
    }

    if (this.stash.length() > 0) html += this.render_stash();

    return html;
  }

  this.render_stash = _ => {
    let rune = this.stash.rune;
    let stash = this.stash.pop();
    let html = '';

    for (let id in stash) {
      let rune = stash[id].rune;
      let line = stash[id].item;

      html += rune.wrap ? `<${rune.sub}><${rune.wrap}>${line.replace(/\|/g,`</${rune.wrap}><${rune.wrap}>`).trim()}</${rune.wrap}></${rune.sub}>` :
      `<${rune.sub}>${line}</${rune.sub}>`;
    }

    return `<${rune.tag} class='${rune.class}'>${html}</${rune.tag}>`;
  }

  this.render = (line = '', rune = null) => {
    if (rune && rune.tag === 'img') return `<img src='media/${line}'/>`;
    // if (rune && rune.tag === 'table') return 'HEY';

    return rune ?
      (rune.tag ?
        `<${rune.tag} class='${rune.class}'>${line}</${rune.tag}>` : line)
        : '';
  }

  this.media = val => `<img src='media/${val}'/>`;

  this.quote = content => {
    const parts = content.split(' | ');
    const text = parts[0];
    const author = parts[1];
    const source = parts[2];
    const link = parts[3];

    return `<quote><p class='text'>${text}</p>${author ? `<p class='attrib'>${link ? `${author}, <a href='${link}'>${source}</a>` : `${author}`}</p>` : ''}</quote>`
  }

  this.html = _ => this.parse(raw);
  this.toString = _ => this.html();
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.prototype.to_url = function() {
  return this.toLowerCase().replace(/ /g, '+').replace(/[^0-9a-z\+]/gi, '').trim();
}

String.prototype.to_path = function() {
  return this.toLowerCase().replace(/ /g, '.').replace(/[^0-9a-z\.]/gi, '').trim();
}

String.prototype.to_markup = function() {
  html = this;
  html = html.replace(/{_/g, '<i>').replace(/_}/g, '</i>');
  html = html.replace(/{\*/g, '<b>').replace(/\*}/g, '</b>');
  html = html.replace(/{\#/g, '<code class="inline">').replace(/\#}/g, '</code>');

  const parts = html.split('{{');

  for (let id in parts) {
    const part = parts[id];
    if (part.indexOf('}}') === -1) continue;
    const content = part.split('}}')[0];
    if (content.substr(0, 1) === '$') {
      html = html.replace(`{{${content}}}`, Ø('operation').request(content.replace('$', '')));
      continue;
    }

    const target = content.indexOf('|') > -1 ? content.split('|')[1] : content;
    const name = content.indexOf('|') > -1 ? content.split('|')[0] : content;
    const external = (target.indexOf('https:') > -1 || target.indexOf('http:') > -1 || target.indexOf('dat:') > -1);

    html = html.replace(`{{${content}}}`, external ? `<a href='${target}' class='external' target='_blank'>${name}</a>` : `<a class='local' title='${target}' onclick="Ø('query').bang('${target}')">${name}</a>`)
  }

  return html;
}
