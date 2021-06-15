async function async1() {
  console.log('async1 start');
  // 易错点在这里，async2会直接运行，但是await后面的代码会变成异步作为微任务执行
  // 所以asnyc1 end会在同步任务完成之后的微任务栈中执行
  await async2();
  console.log('asnyc1 end');
};

async function async2() {
  console.log('async2');
};

console.log('script start');

setTimeout(() => {
  console.log('setTimeOut');
}, 0);

async1();

new Promise(function (reslove) {
  console.log('promise1');
  reslove();
}).then(function () {
  console.log('promise2');
});

console.log('script end');

// script start
// async1 start
// async2
// promise1
// script end
// asnyc1 end
// promise2
// setTimeOut