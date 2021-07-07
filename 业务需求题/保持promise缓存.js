function createP (num) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          console.log('触发resolve');
          resolve(num);
      }, 1000);
  })
}

var a = createP(3);

a.then((s) => console.log(s));

setTimeout(() => {
  console.log('重复触发promise');
  // 下面这个方法会直接触发，不会再次触发上面的"触发resolve"事件
  // 因为运行一次之后，promise的状态已经变成resolve了
  // 可以将promise存储下来，作为缓存
  a.then((s) => console.log(s));
}, 5000);