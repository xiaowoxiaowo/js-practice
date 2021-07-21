// 函数组合方法compose
const add = num => num  + 10
const multiply = num => num * 2
const foo = compose(multiply, add)
foo(5) // 从最右边的方法开始运行，30


function compose(...arg){
	return function(initArg){
		var result = initArg;
		for(var i = args.length -1; i >=0; i--){
			result = args[i](result);
		}
		return result;
	}
}

//调用ReduceRight()
function compose1(...arg){
	return function(initArg){
		return args.reduceRight((init, current) => {
			return current(init);
		},initArg)
	}
}