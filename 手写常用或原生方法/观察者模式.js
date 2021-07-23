// 观察者
class Watcher {
  constructor(fn) {
      if (typeof fn === 'function') {
          this.fn = fn
      } else {
          throw new Error('Observer构造器必须传入函数类型！')
      }
  }
  update() {
      this.fn()
  }
}

// 目标对象
class Dep {
  constructor() {
      this.observerList = []
  }
  add(observer) {
      this.observerList.push(observer)
  }
  notify() {
      this.observerList.forEach(observer => observer.update() )
  }
}

// 
const observerCallback = function () {
  console.log('我被通知了')
}
const observer = new Watcher(observerCallback)
const subject = new Dep()
subject.add(observer)
subject.notify()