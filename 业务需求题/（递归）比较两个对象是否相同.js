// 对象的深度比较

// 已知有两个对象obj1和obj2，实现isEqual函数判断对象是否相等
const obj1 = {
  a: 1,
  c: 3,
  b: {
    c: [1, 2]
  }
}
const obj2 = {
  c: 4,
  b: {
    c: [1, 2]
  },
  a: 1
}

// isEqual函数，相等输出true，不相等输出false
// 解答
// 递归思路，一层层遍历
const isEqual = (obj1, obj2) => {
  // Object.keys对对象和数组都能成立
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  const isObj = (data) => typeof data === 'object' && data !== null;
  for (let i = 0; i < keys1.length; i ++) {
    const k = keys1[i];
    // 如果两个数据格式不一致，直接返回false
    if (isObj(obj1[k]) !== isObj(obj2[k])) return false;
    // 如果两个数据是基本数据类型，直接判断数值
    if (!isObj(obj1[k]) && obj1[k] !== obj2[k]) return false;
    // 如果两个数据是引用数据类型，递归进行判断
    if (isObj(obj1[k]) && !isEqual(obj1[k], obj2[k])) return false;
  }
  return true;
};

console.log(isEqual(obj1, obj2));