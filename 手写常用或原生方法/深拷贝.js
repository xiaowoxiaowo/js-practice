/**
 * 深拷贝
 * 判断正则类型，数据类型，基本数据类型
 * 防止重复嵌套
 */
 function deepClone(data, map = new WeakMap) {
  if (data instanceof RegExp) return new RegExp(data);
  if (data instanceof Date) return new Date(data);
  if (typeof data !== 'object' || data === null) return data;
  const obj = new data.constructor();
  if (map.has(data)) return map.get(obj);
  map.set(data, obj);
  for (let i in data) {
    if (data.hasOwnProperty(i)) {
      obj[i] = deepClone(data[i], map);
    }
  }
  return obj;
}
