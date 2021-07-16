const curry = (fn, ...args) => {
  return args.length < fn.length //函数参数的数量
   ? (...argument) => curry(fn, ...args, ...arguments)
   : fn(...args)
}

function sumFn(a, b, c) {
  return a + b + c
}
var sum = curry(sumFn)
sum(2)(3)(5) //10
sum(2, 3)(5) //10
sum(2, 3, 5) //10
sum(2)(3, 5) //10