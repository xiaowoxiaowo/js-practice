/***
 *
 * @param fn 回调函数
 * @param wait 防抖时间
 * @param immediate 是否立即触发
 * @returns {Function}
 */
function debounce (fn, wait = 200, immediate = false) {
  let timeout = null
  return function (...arg) {   //支持传入参数
    if ((timeout === null) && immediate) {  //当需要立即执行的时候，第一次执行函数
      fn.apply(this, arg)
    } else {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      fn.apply(this, arg)   //因为当前函数是return出去的，所以this就是当前作用域
      timeout = null      //函数执行，重置timeout，准备下次的防抖
    }, wait)
  }
}