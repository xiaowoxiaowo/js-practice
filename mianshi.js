/**
 * https://mp.weixin.qq.com/s/RLQHkTtlkNmRupMrJGJfKg
 * tapable
 * module, chunk, bundle的区别
 * webpack优化构建速度(开发，生产)
 * TCP三次握手，SYN，SYN.ACK，ACK；TCP四次握手关闭连接：FIN，ACK/FIN，ACK
 * 什么是同源策略以及限制
 * 重排Reflow
 * 重绘Repaint
 * 垃圾回收
 * 
 * TCP 丢包阻塞问题
 * 一个异步任务调度器，最多同时执行两个异步任务
 * 
 * react hooks 实现原理
 * 说下输入一个 url 地址的全过程。
 * 
 * dom树是怎么解析的
 * webpack hmr原理，怎么保留之前更改的状态
 * react-redux
 * useSelector
 */
async function async1() {
  console.log('async1 start');
  await async2(); 
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
  // 注意：这里如果返回 Promise 的话执行顺序就不一样了
}
console.log('script start');
setTimeout(function() {
  console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
  console.log('promise1');
  resolve();
}).then(function() {
  console.log('promise2');
});
console.log('script end');

// 单向链表输出倒数第 K 个元素