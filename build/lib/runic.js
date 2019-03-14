const fs = require('fs');

const RUNES = {
  '&': {tag: 'p'},
  '*': {tag: 'h2'},
  '-': {tag: 'ol', sub: 'li', stash: 1},
  '=': {tag: 'ul', sub: 'li', stash: 1},
  '@': {tag: 'blockquote'},
  '#': {tag: 'code', sub: 'ln', stash: 1},
  '>': {tag: 'ul', sub: 'li', stash: 1}
}

module.exports = function (raw) {
  this.raw = raw

  /**
   * Check if link is external
   * @param {string} t - Target
   * @return {boolean} Is external?
   */
  const _isExternal = t => !!~t.indexOf('https:') || !!~t.indexOf('http:')

  /**
   * Widow control
   * @param {string} content
   * @return {string} Formatted content
   */
  function _widow (content) {
    let c = content.split(' ')
    let last = c.pop()
    c[c.length - 1] += `&nbsp;${last}`
    return c.join(' ')
  }

  const _parI = c => c.replace(/{_/g, '<em>').replace(/_}/g, '</em>')
  const _parB = c => c.replace(/{\*/g, '<strong>').replace(/\*}/g, '</strong>')

  function _parA (c) {
    let html = c
    const parts = html.split('{{')

    for (let i = 0, l = parts.length; i < l; i++) {
      const part = parts[i]
      if (part.indexOf('}}') < 0) continue

      const content = part.split('}}')[0]
      let target = '', name = ''

      if (content.indexOf('|') > -1) {
        [name, target, title] = content.split('|')
      } else {
        target = name = content
      }

      const ttl = title ? title : name
      const link = _isExternal(target)
        ? `<a href="${target}"title="${ttl}"target="_blank">${name}</a>`
        : `<a href="./${target.toUrl()}.html"title="${ttl}">${name}</a>`

      html = html.replace(`{{${content}}}`, link)
    }

    return html
  }

  function _toMarkup (s) {
    let h = s
    h = _parI(h)
    h = _parB(h)
    h = _parA(h)
    return h
  }

  this.stash = {
    rune: {},
    all: [],

    /**
     * Add to stash
     * @param {Object} rune
     * @param {string} item
     */
    add (rune, item) {
      this.rune = rune
      this.all[this.all.length] = {rune, item}
    },

    isPop (rune) {
      return this.all.length > 0 && rune.tag !== this.rune.tag
    },

    length () {
      return this.all.length
    },

    pop () {
      const copy = this.all
      this.all = []
      return copy
    }
  }

  this.parse = _ => {
    const raw = this.raw
    if (!raw) return ''
    let html = ''

    for (let i = 0, l = raw.length; i < l; i++) {
      let line = raw[i]
      const char = line[0]
      const rune = RUNES[char]
      let content = line.substr(2)

      if (char === '&') content = _widow(content)
      line = _toMarkup(content)
      if (!line || line.trim() === '') continue

      switch (char) {
        case '%': html += this.media(content); continue
        case '@': html += this.quote(content); continue
        case '>': this.stash.add(rune, this.termItem(line)); continue
        default: break
      }

      if (!rune) {
        console.warn(`Unknown rune: ${char} : ${line}`)
        continue
      }

      if (rune.stash) {
        this.stash.add(rune, line)
        continue
      }

      if (this.stash.isPop(rune)) html += this.renderStash()

      html += this.render(rune, line)
    }

    return this.stash.length() > 0 ? html += this.renderStash() : html
  }

  this.renderStash = _ => {
    let stash = this.stash.pop()
    let {tag} = this.stash.rune
    let html = ''

    for (let i = 0, l = stash.length; i < l; i++) {
      const {rune: {sub}, item} = stash[i]
      html += `<${sub}>${item}`
    }

    return `<${tag}>${html}</${tag}>`
  }

  this.render = (rune, line = '') => {
    const {tag} = rune
    return tag ? `<${tag}>${line}</${tag}>` : line
  }

  this.termItem = content => {
    let [term, def] = content.split(' : ')
    return `<strong>${term.trim()}</strong>: ${def.trim()}`
  }

  this.media = content => {
    let html = ''
    const gallery = content.split(' ')
    const png = x => !~x.indexOf('.') ? `${x}.png` : x
    for (let i = 0, l = gallery.length; i < l; i++) {
      let img = gallery[i]
      const imgM = `m/${png(img)}`
      const imgS = `m/${png(`${img}-s`)}`

      html += fs.existsSync(`./wiki/${imgS}`)
        ? `<img srcset="${imgS} 500w,${imgM} 800w"sizes="(max-width:30em) 500px,800px"src="${imgM}"alt="">`
        : `<img src="${imgM}"alt="">`
    }
    return html
  }

  this.quote = content => {
    const [text, author, source, link] = content.split(' | ')
    const attr = source
      ? link
        ? `${author}, <a href="${link}"target="_blank">${source}</a>`
        : `${author}, ${source}`
      : author
    return `<blockquote><p class="q">${text}${author ? `<p class="a">&mdash; ${attr}` : ''}</blockquote>`
  }

  this.html = _ => this.parse()
}
