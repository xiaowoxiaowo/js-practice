// 判断JS对象是否存在循环引用
const obj = {
  a: 1,
  b: 2,
};
 
obj.c = obj;
 
 // isHasCircle函数， 存在环输出true，不存在的话输出false
const isHasCircle = (obj) => {
  // 循环调用不一定是调用最外层，有可能调用的是内部的某个对象，所以需要通过一个集合来存储
  // 使用弱引用的WeakSet来存储（WeakSet只能存储对象）
  const map = new WeakSet();
  map.add(obj);
  const loop = (data) => {
    const keys = Object.keys(data);
    // 遍历所有的key
    for (let i = 0; i < keys.length; i ++) {
      const val = data[keys[i]];
      if (typeof val === 'object' && val !== null) {
        // 如果是对象，而且之前在WeakSet中存储过了，返回true
        if (map.has(val)) return true;
        // 如果没有存储过，加入到WeakSet中
        map.add(val);
        // 继续递归
        if (loop(val)) return true;
      }
    }
    return false;
  };
  return loop(obj);
};
