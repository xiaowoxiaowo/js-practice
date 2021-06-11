// 判断JS对象是否存在循环引用
const obj = {
  a: 1,
  b: 2,
};
 
obj.c = obj;
 
 // isHasCircle函数， 存在环输出true，不存在的话输出false
const isHasCircle = (obj) => {
  const map = new Set();
  map.add(obj);
  const loop = (data) => {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i ++) {
      const val = data[keys[i]];
      if (typeof val === 'object' && val !== null) {
        if (map.has(val)) return true;
        map.add(val);
        return loop(val);
      }
    }
    return false;
  };
  return loop(obj);
};
