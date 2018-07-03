function DomPhotoNode(id, rect, ...params) {
  DomNode.call(this, id, rect);

  this.media = document.createElement('media');
  this.glyph = NODE_GLYPHS.photo;

  this.install = elements => {
    this.is_installed = true;
    this.el.appendChild(this.media);

    for (let id in elements) {
      this.el.appendChild(elements[id]);
    }
  }

  this.update = content => {
    if (content !== '') {
      this.media.style.backgroundImage = `url(img/${content})`;
      this.el.className = '';
    } else {
      this.el.className = 'empty';
      this.update_header();
    }
  }

  this.update_header = (v = true) => {
    Ø('header').el.className = v ? 'dark' : 'light';
  }
}
