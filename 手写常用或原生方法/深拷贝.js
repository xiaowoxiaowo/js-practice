/**
 * 深拷贝
 * 判断正则类型，数据类型，基本数据类型
 * 防止重复嵌套
 */
function deepClone(data, cache = new Weakmap()) {
  if (data instanceof RegExp) return new RegExp(data);
  if (data instanceof Date) return Date(data);
  if (data === null || typeof data != 'object') return data;
  let obj = new data.constructor();
  if (cache.has(data)) {
		return cache.get(data);
	}	
	cache.set(data, obj);
  for (let i in data) {
    if (data.hasOwnProperty(i)) {
      obj[i] = deepClone(data[i], cache);
    }
  }
  return obj;
}
