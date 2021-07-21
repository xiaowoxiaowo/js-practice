Array.prototype.consMap = function(fn,context){
	// 处理数组类型异常 
	if (this === null || this === undefined) { 
			throw new TypeError("Cannot read property 'map' of null or undefined") 
	}
	if(!(fn instanceof Function)){
			throw new TypeError(fn + ' is not a function')
	}
	var arr = this;   //this指代实例化的数组
	var newArr = [];
	for(var i = 0;i< arr.length;i++){
			var newValue = fn.call(context,arr[i],i,arr);
			newArr.push(newValue);
	}
	return newArr;
}