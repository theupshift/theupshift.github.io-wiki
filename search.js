var s = document.getElementById("s"),
  c = s.value;
Object.assign(s, {
  placeholder: "Search",
  onkeydown: function (a) {
    if ("Enter" === a.key) {
      a = s.value.trim();
      const u = "home" === a.toLowerCase() ? "./index" : "./" + url(a);
      window.location.href = u + ".html";
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
