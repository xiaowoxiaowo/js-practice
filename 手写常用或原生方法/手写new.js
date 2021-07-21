/**
 * new被调用后做了三件事情:
 * 1.创建一个空对象，构造函数中的this指向这个空对象
 * 2.这个新对象被执行 [[原型]] 连接
 * 3.执行构造函数方法，属性和方法被添加到this引用的对象中
 * 4.如果构造函数中没有返回其它对象，那么返回this，即创建的这个的新对象，否则，返回构造函数中返回的对象。
 */

function _new(ctor, ...args) {
  let obj = new Object();
  //给new出来的对象设置原型链
  obj.__proto__ = Object.create(ctor.prototype);
  //获取定义在ctor里的私有属性
  let res = ctor.apply(obj, args);

  //判断ctor更改作用域之后的res变量原型是否为obejct
  let isObject = typeof res === 'object' && typeof res !== null;
  //判断ctor更改作用域之后的res变量原型是否为obejct
  let isFunction = typeof res === 'function';
  //是的话，返回res。不是的话，返回基于ctor.prototype创建的原型对象
  return isObject || isFunction ? res : obj;
}
