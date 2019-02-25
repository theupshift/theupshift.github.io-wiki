module.exports = function (data) {
  this.data = data;

  function format (line) {
    let a = [], h = {};
    const {children} = line;

    for (let i = 0, l = children.length; i < l; i++) {
      const child = line.children[i];
      const {term, value, content} = child;

      if (child.children.length === 0 && content) {
        a[a.length] = content;
      } else {
        h[content] = format(child);
      }
    }

    return a.length > 0 ? a : h;
  }

  function liner (line) {
    return {
      skip: line === '' || line.substr(0, 1) === '~',
      indent: line.search(/\S|$/),
      content: line.trim(),
      children: []
    }
  }

  this.parse = () => {
    const lines = this.data.split('\n').map(liner);
    let stack = {}, target = lines[0], h = {};

    for (let i = 0, l = lines.length; i < l; i++) {
      const line = lines[i];
      if (line.skip) continue;
      target = stack[line.indent - 2];
      if (target) target.children[target.children.length] = line;
      stack[line.indent] = line;
    }

    for (let i = 0, l = lines.length; i < l; i++) {
      let line = lines[i];
      if (line.skip || line.indent > 0) continue;
      let term = line.content;
      let root = 'HOME', type = 'page', sli = true;

      switch (term[0]) {
        case '@': type = 'portal'; break;
        case '+': type = 'note'; break;
        case '!': type = 'status'; break;
        default: sli = false; break;
      }

      if (sli) term = term.slice(2);
      type = term === root ? 'home' : type;

      term.indexOf('.') > -1 && ([root, term] = term.split('.'));
      h[term] = {term, root, type, line: format(line)};
    }

    return h;
  }
}
