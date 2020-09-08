function deepClone(data, cache = new Weakmap()) {
  if (data instanceof RegExp) return new RegExp(data);
  if (data instanceof Date) return Date(data);
  if (data === null || typeof data != 'object') return data;
  let obj = new data.constructor()
  if (cache.hasItem(obj)) {
    return cache.getItem(obj);
  }
  for (let i in data) {
    if (data.hasOwnProperty(i)) {
      obj[i] = data[i];
    }
  }
  return obj;
}
