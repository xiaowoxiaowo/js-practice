Object.prototype.bind = function (context, ...args) {
	// 异常处理
	if (typeof this !== "function") {
		throw new Error("error");
	}
	// 保存this的值，它代表调用 bind 的函数
	var self = this;
	//因为bind回调之后是一个函数对象，需要在后面加()才能运行。apply和call是直接运行的
	//所以在这里需要先定义一个function，return一个函数对象
	var fbound = function () {
			//instanceof判断self的构造函数是否在this的原型链上
		 //Array.prototype.slice.call(arguments)能将具有length属性的对象(key值为数字)转成数组
			self.apply(context, [...args, ...arguments]);
	}
	//返回的函数不仅要和被调函数的函数体相同，也要继承人家的原型链
	fbound.prototype = Object.create(this.prototype);
	return fbound;
}