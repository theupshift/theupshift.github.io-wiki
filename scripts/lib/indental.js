'use strict';
function Indental(data) {
  this.data = data;

  this.parse = type => {
    const lines = this.data.split('\n').map(liner);

    // Assoc lines
    let stack = {};
    let target = lines[0];
    for (let id in lines) {
      const line = lines[id];
      if (line.skip) continue;
      target = stack[line.indent - 2];
      if (target) {
        target.children[target.children.length] = line;
      }
      stack[line.indent] = line;
    }

    // Format
    let h = {};
    for (let id in lines) {
      const line = lines[id];
      if (line.skip || line.indent > 0) continue;
      const key = line.content.toUpperCase();
      h[key] = type ? new type(key, format(line)) : format(line);
    }

    return h;
  }

  const format = line => {
    let a = [];
    let h = {};

    for (let id in line.children) {
      const child = line.children[id];

      if (child.key) {
        h[child.key.toUpperCase()] = child.value;
      } else if (child.children.length === 0 && child.content) {
        a[a.length] = child.content;
      } else {
        h[child.content.toUpperCase()] = format(child);
      }
    }

    return a.length > 0 ? a : h;
  }

  const liner = line => {
    return {
      indent: line.search(/\S|$/),
      content: line.trim(),
      skip: line === '' || line.substr(0, 1) === '~',
      key: line.indexOf(' : ') > -1 ? line.split(' : ')[0].trim() : null,
      value: line.indexOf(' : ') > -1 ? line.split(' : ')[1].trim() : null,
      children: []
    }
  }
}
