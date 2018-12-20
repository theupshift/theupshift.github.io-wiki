const s = document.getElementById('s');
s.value = document.title;
let c = s.value;
Object.assign(s, {
  placeholder: 'Search',
  onkeydown: (e) => {
    if (e.key !== 'Enter') return;
    const v = s.value.trim();
    if (window.location.href.indexOf('index.html') > -1) {
      window.location.href = v.toLowerCase() === 'home' ? './index.html' : `./wiki/${url(v)}.html`;
    } else {
      window.location.href = v.toLowerCase() === 'home' ? '../index.html' : `./${url(v)}.html`;
    }
  },
  onblur: () => {
    s.value = cap(c);
  },
  onfocus: () => {
    c = s.value;
    Object.assign(s, {
      title: 'Search for a page or topic',
      value: ''
    });
  }
});

function cap (x) {
  return x.charAt(0).toUpperCase() + x.slice(1).toLowerCase();
}

function url (x) {
  return x.replace(/ /g, '_').replace(/\W/g, '').trim().toLowerCase();
}
