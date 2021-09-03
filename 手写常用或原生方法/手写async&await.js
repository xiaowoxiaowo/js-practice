const getData = () => new Promise(resolve => setTimeout(() => resolve("data"), 1000))
  
var test = asyncToGenerator(
    function* testG() {
      // await被编译成了yield
      const data = yield getData()
      console.log('data: ', data);
      const data2 = yield getData()
      console.log('data2: ', data2);
      return 'success'
    }
)

function asyncToGenerator(generatorFunc) {
	return function() {
		const gen = generatorFunc.apply(this, arguments)
		return new Promise((resolve, reject) => {
			function step(key, arg) {
				let generatorResult
				try {
					generatorResult = gen[key](arg)
				} catch (error) {
					return reject(error)
				}
				const { value, done } = generatorResult
				if (done) {
					return resolve(value)
				} else {
					return Promise.resolve(value).then(val => step('next', val)).catch(err => step('throw', err));
				}
			}
			step("next")
		})
	}
}