class 黄金 {
	test() {

	}
}
class 钻石 {
	constructor() {
		this.ifBP = true
		this.canJoinPeaked = false
	}
}
class 王者 {
	constructor() {
		this.ifBP = true
		this.canJoinPeaked = true
	}
}
function Factory(level) {
	switch(level) {
			case '黄金':
					return new 黄金()
					break
			case '钻石':
					return new 钻石()
					break
			case '王者':
					return new 王者()
					break
			...
	}
}	
