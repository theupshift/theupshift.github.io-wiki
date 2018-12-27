function _findSimilar(target, list = lexicon) {
  let similar = [];
  for (let i = 0, l = list.length; i < l; i++) {
    const word = list[i];
    similar[similar.length] = {
      word,
      value: _similarity(target, word)
    }
  }
  return similar.sort((a, b) => a.value - b.value).reverse();
}

function _similarity(a, b) {
  let v = 0;
  for (let i = 0; i < a.length; i++) v += +(b.indexOf(a.substr(i)) > -1);
  for (let i = 0; i < b.length; i++) v += +(a.indexOf(b.substr(i)) > -1);
  const c = a.split('').sort().join('');
  const d = b.split('').sort().join('');
  for (let i = 0; i < c.length; i++) v += +(d.indexOf(c.substr(i)) > -1);
  for (let i = 0; i < d.length; i++) v += +(c.indexOf(d.substr(i)) > -1);
  return v;
}
