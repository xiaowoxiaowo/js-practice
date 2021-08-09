/***
 *
 * @param func 传入的回调函数
 * @param wait 节流时间
 * @returns {Function}
 */
function throttle (func, wait = 2000) {
  let timeout = null
  return function(...arg) {
    if (!timeout) {    //在wait时间未到的时候，不进行触发
      timeout = setTimeout(() => {
        timeout = null
        func.apply(this, arg)
      }, wait)
    }
  }
}
