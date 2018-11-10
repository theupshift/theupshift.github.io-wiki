function DomPhotoNode(id, ...params) {
  DomNode.call(this, id);

  this.media = document.createElement('media');

  this.install = (elements) => {
    this.isInstalled = true;
    this.el.appendChild(this.media);

    for (let id in elements) {
      this.el.appendChild(elements[id]);
    }
  }

  this.update = (content) => {
    if (content !== '') {
      this.media.style.backgroundImage = `url(img/${content})`;
    } else {
      this.el.className = 'empty';
      this.update_header();
    }
  }

  this.update_header = (v = true) => {
    Ø('header').el.className = v ? 'dark' : 'light';
  }
}
