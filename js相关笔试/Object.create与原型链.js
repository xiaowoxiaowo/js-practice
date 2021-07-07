var obj1 = {name:'one'};
obj2 = Object.create(obj1);
obj2.name = 'two';
console.log(obj1.name);
//one

var obj1 = {prop:{name:'one'}};
obj2 = Object.create(obj1);
obj2.prop.name = 'two';
console.log(obj1.prop.name);
//two

var obj1 = {list:['one','one','one']};
obj2 = Object.create(obj1);
obj2.list[0] = 'two';
console.log(obj1.list[0]);
//two

/**
 * 原理:
 *
 * Object.create是将obj2.__proto__指向obj1
 * obj2.name = 'two'是直接设置属性，所以在obj2里会重新定义一个name
 * obj2.prop.name = 'two'的前面部分obj2.prop是获取属性，因为obj2没有，所以会从原型链上查找，找到之后给.name赋值，所以会变
 * obj2.list[0]也是同理,先查找obj2.list然后再通过序号设置属性
 *
 */