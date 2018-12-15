const s = document.getElementById('s');
s.value = document.title;
let current = s.value;
Object.assign(s, {
  placeholder: 'Search',
  onkeydown: (e) => {
    if (e.key !== 'Enter') return;
    window.location.href = `${s.value.trim().toUrl()}.html`;
  },
  onblur: () => {
    s.value = current.toCapitalCase();
  },
  onfocus: () => {
    current = s.value;
    Object.assign(s, {
      title: 'Search for a page or topic',
      value: ''
    });
  }
});

String.prototype.toCapitalCase = function () { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() }

String.prototype.toUrl = function () { return this.replace(/ /g, '_').replace(/\W/g, '').trim().toLowerCase() }

function validate (value) {
  window.location.href = 'http://www.google.com';
  Q('q').bang(value);
}
