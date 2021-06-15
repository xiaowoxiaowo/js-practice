/**
 * 假设本地机器无法进行加减乘除运算，现在提供一个后端的请求方法asyncAdd，可以返回两数之和
 */
asyncAdd(3, 5, (err, result) => {
  console.log(result); // 8
})

// 现在要求实现一个sum函数，满足以下用法
(async () => {
  const res1 = await sum(1, 4, 6, 9, 2, 4);
  const res2 = await sum(3, 4, 9, 2, 5, 3, 2, 1, 7);
  const res3 = await sum(1, 6, 0, 5);
  console.log([res1, res2, res]); // [26, 36, 12]
})();


function sendAddRequest(a, b) {
  return new Promise((resolve, reject) => {
    asyncAdd(a, b, (err, result) => {
      resolve(result);
    })
  })
}

async function sum(...args) {
  let res = 0;
  while(args.length > 0) {
    res = await sendAddRequest(res, args.shift());
  }
  return res;
}
