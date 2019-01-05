var s = document.getElementById("s"),
  c = s.value;
Object.assign(s, {
  placeholder: "Search",
  onkeydown: function (a) {

    if ("Enter" === a.key) {
      a = s.value.trim();
      let u = '';

      if (window.location.href.indexOf("index.html") > -1) {
        console.log('surface')
        u = "home" === a.toLowerCase() ? "./index.html" : "./wiki/" + url(a) + ".html"
      } else {
        console.log('underwater')
        u = "home" === a.toLowerCase() ? "../index.html" : "./" + url(a) + ".html"
      }
      window.location.href = u;
    }
  },
  onblur: function() {
    s.value = cap(c)
  },
  onfocus: function() {
    c = s.value;
    Object.assign(s, {
      title: "Search for a page or topic",
      value: ""
    })
  }
});

function cap(a) {
  return a[0].toUpperCase() + a.slice(1).toLowerCase()
}

function url(a) {
  return a.replace(/ /g, "_").replace(/\W/g, "").trim().toLowerCase()
}
document.onkeydown = function(a) {
  var b = a.which;
  a.ctrlKey || (65 <= b && 90 >= b && s.focus(), 27 === b && s.blur())
};
