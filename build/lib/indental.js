module.exports = function Indental (data) {
  this.data = data;

  this.parse = () => {
    const lines = this.data.split('\n').map(liner);
    let stack = {};
    let target = lines[0];
    let h = {};

    // Assoc lines
    for (let i = 0, l = lines.length; i < l; i++) {
      const line = lines[i];
      if (line.skip) continue;
      target = stack[line.indent - 2];
      if (target) target.children[target.children.length] = line;
      stack[line.indent] = line;
    }

    // Format
    for (let i = 0, l = lines.length; i < l; i++) {
      let line = lines[i];
      if (line.skip || line.indent > 0) continue;
      let term = line.content.toUpperCase();
      let unde = 'Home';
      let type = 'page';

      if (term.indexOf('@') > -1) {
        term = term.slice(2);
        type = term === 'HOME' ? 'home' : 'portal';
      } else if (term.indexOf('+') > -1) {
        term = term.slice(2);
        type = term === 'HOME' ? 'home' : 'index';
      } else if (term.indexOf('!') > -1) {
        term = term.slice(2);
        type = term === 'HOME' ? 'home' : 'status';
      }

      if (term.indexOf('.') > -1) {
        const split = term.split('.');
        unde = split[0];
        term = split[1];
      }

      h[term] = {term, unde, type, line: format(line)}
    }

    return h;
  }

  function format(line) {
    let a = [];
    let h = {};

    const {
      children
    } = line;

    for (let i = 0, l = children.length; i < l; i++) {
      const child = line.children[i];
      const {
        term,
        value,
        content
      } = child;

      if (term) {
        h[term] = value;
      } else if (child.children.length === 0 && content) {
        a[a.length] = content;
      } else {
        h[content] = format(child);
      }
    }

    return a.length > 0 ? a : h;
  }

  function liner(line) {
    let term = null;
    let value = null;

    if (line.indexOf(' : ') > -1) {
      const split = line.split(' : ');
      value = split[1].trim();
      term = split[0].trim();
    }

    return {
      skip: line === '' || line.substr(0, 1) === '~',
      indent: line.search(/\S|$/),
      content: line.trim(),
      children: [],
      value,
      term,
    }
  }
}
