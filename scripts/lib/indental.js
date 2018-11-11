'use strict';

function Indental (data) {
  this.data = data;

  this.parse = (type) => {
    const lines = this.data.split('\n').map(liner);

    // Assoc lines
    let stack = {};
    let target = lines[0];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.skip) continue;
      target = stack[line.indent - 2];
      if (target) target.children[target.children.length] = line;
      stack[line.indent] = line;
    }

    // Format
    let h = {};
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.skip || line.indent > 0) continue;
      const key = line.content.toUpperCase();
      h[key] = type ? new type(key, format(line)) : format(line);
    }

    return h;
  }

  function format(line) {
    let a = [];
    let h = {};

    for (let i = 0; i < line.children.length; i++) {
      const child = line.children[i];
      const {key, children, value, content} = child;

      if (key) {
        h[key.toUpperCase()] = value;
      } else if (children.length === 0 && content) {
        a[a.length] = content;
      } else {
        h[content.toUpperCase()] = format(child);
      }
    }

    return a.length > 0 ? a : h;
  }

  function liner (line) {
    let key = null;
    let value = null;

    if (line.indexOf(' : ') > -1) {
      const split = line.split(' : ');
      value = split[1].trim();
      key = split[0].trim();
    }

    return {
      skip: line === '' || line.substr(0, 1) === '~',
      indent: line.search(/\S|$/),
      content: line.trim(),
      children: [],
      value,
      key,
    }
  }
}
