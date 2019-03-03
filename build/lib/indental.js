module.exports = function (data) {
  this.data = data;

  function _format (line) {
    let a = [], h = {};
    const {children} = line;
    for (let i = 0, l = children.length; i < l; i++) {
      a[a.length] = children[i].content;
    }
    return a.length > 0 ? a : h;
  }

  function _liner (line) {
    return {
      skip: line === '' || line[0] === '~',
      indent: line.search(/\S|$/),
      content: line.trim(),
      children: []
    }
  }

  this.parse = () => {
    const lines = this.data.split('\n').map(_liner);
    const l = lines.length;
    let stack = {}, target = lines[0], h = {};

    for (let i = 0; i < l; i++) {
      const line = lines[i];
      if (line.skip) continue;
      target = stack[line.indent - 2];
      if (target) target.children[target.children.length] = line;
      stack[line.indent] = line;
    }

    for (let i = 0; i < l; i++) {
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
      h[term] = {term, root, type, line: _format(line)};
    }

    return h;
  }
}
