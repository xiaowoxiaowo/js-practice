Object.prototype.call = function (context, ...args) {
  var context = context || window;
  //context是call2传入的第一个参数，比如下文的window。 this是调用call2这个方法的函数上下文
  //在传入的context作用域下，定义一个.fn属性，将调用call2这个方法的函数上下文放到里面
  context.fn = this;
  //将call2后面带的参数传入刚在context作用域下面定义的fn方法里，返回一个生成的函数
  var result = context.fn(...args);
  //删除定义的fn，保持context环境里的变量不被污染
  delete context.fn;
 //返回生成的函数去运行
 return result;
}


Object.prototype.apply = function (context, args) {
  let context = context || window;
  let result;
  context.fn = this;
  result = context.fn(...args);
  delete context.fn;
  return result;
}