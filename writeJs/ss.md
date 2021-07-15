## 前言
介绍一些我在`js`编程中常用的一些设计模式，**本文没有理论的设计模式的知识，每个模式都会从实际的例子出发，说明为什么要使用相应的设计模式？怎么去使用？**

大家也不要觉得设计模式很难，很高级，之所以觉得“难”，只是因为纯理论知识的枯燥难懂，我会从实际例子出发，用非常接地气的方式，给大家列举一些我们平时常用，好用的一些设计模式的具体实践。
## 设计模式简介
简单介绍一下设计模式，指导理论一共有5个基本原则
- 单一功能原则
- 开放封闭原则
- 里式替换原则
- 接口隔离原则
- 依赖反转原则

23个经典的模式
![](https://imgkr2.cn-bj.ufileos.com/18091d07-74c1-4b07-80c9-2ffc9c0f294e.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=%252FsahabBnn1GRofD0VeSCuFiOS3g%253D&Expires=1602939909)
这些内容看过一遍就行，不需要深入去了解。对于基本原则，在`js`的编程设计中，了解“单一功能“和“开放封闭”基本就够用。对于模式上，很多的模式其实我也根本没有使用过，因为设计模式的产生初衷，是为了补充 Java 这样的静态语言的不足。许多"经典"设计模式，在编程语言的演化中，早已成为语言机制的一部分。比如，export 内建了对单例模式的支持、将内容用 function 包装一层就是工厂模式、yield 也实现了迭代器模式等等。
## 为什么要使用设计模式

设计模式的核心思想只有一个，那就是**封装变化**。借用修言大佬的话
>实际开发中，不发生变化的代码可以说是不存在的。我们能做的只有将这个变化造成的影响最小化 —— 将变与不变分离，确保变化的部分灵活、不变的部分稳定。

这就是平时我们常说的“健壮”的代码，而设计模式就是帮助我们实现这个目的的工具。
## 简单工厂模式
不说理论，直接上例子。

>在王者荣耀里，根据每个人的星级数量，都会有一个排位的等级，现在比如有三个等级，黄金，钻石，王者。它们三个有一点区别，黄金段位是全英雄匹配，钻石和王者是BP模式的匹配。王者段位可以进行巅峰赛，但是其他两个不行。现在有个需求，让你通过段位来返回一个相应的实例，而且需要符合这些区别？

这对于我们来说，也太轻松了吧。噼里啪啦几几分钟，代码就写好了。
```js
class 黄金 {
  constructor() {
    this.level = '黄金'
    this.ifBP = false
    this.canJoinPeaked = false
  }
}
class 钻石 {
  constructor() {
    this.level = '钻石'
    this.ifBP = true
    this.canJoinPeaked = false
  }
}
class 王者 {
  constructor() {
    this.level = '王者'
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
  }
}	
```
>后面王者更新了，如果新增了10个新的段位，你要怎么改这个代码？还是一个个手动添加吗？

现在让我们来改造一下
```js
class 段位通用类 {
  constructor(level, ifBP, canJoinPeaked) {
    this.level = level
    this.ifBP = ifBP
    this.canJoinPeaked = canJoinPeaked
  }
}
function Factory(level) {
	let ifBP, canJoinPeaked
  switch(level) {
    case '黄金':
      ifBP = false
      canJoinPeaked = false
      break
    case '钻石':
      ifBP = true
      canJoinPeaked = false
      break
    case '王者':
      ifBP = true
      canJoinPeaked = true
      break
  }
  return new 段位通用类(level, ifBP, canJoinPeaked)
}	
```
这个就是简单工厂模式的具体应用，将**创建对象的过程封装**，我们不需要去关心具体的内容，只要传入参数，拿到工厂给我们的对象即可。
## 策略模式
> 王者荣耀里，我们如果进行排位赛，会根据你的段位去匹配一起游戏的玩家，现在有个需求，要求写一个排位匹配函数，根据玩家当前的段位等级，来执行不同段位的排位匹配功能？

这对于习惯了if-else的我们来说，也是如此简单。
```js
class 王者账号 {
  constructor() {}
  排位匹配(level) {
    if (level === '黄金') {
      console.log('执行黄金段位的匹配')
      // 这里只是举个例子，平时开发，这里可能会有很长一段的复杂代码逻辑
    }
    if (level === '钻石') {
      console.log('执行钻石段位的匹配')
    }
    if (level === '王者') {
      console.log('执行王者段位的匹配')
    }
  }
}
王者账号.排位匹配('黄金')
```
代码写完了，功能实现了，运行起来的确没问题。但是其实这里存在多个隐患。
- 没有遵循单一功能原则，这里在一个函数里处理了多种情况的逻辑，万一其中有一个出了bug，后续的逻辑就都无法运行了。而且功能都放在一起，功能的抽离复用变得很困难。
- 没有遵循开放封闭原则（只新建，不修改），如果后续又多了一个段位，只能继续通过if去判断，导致每次新增都要对这个排位匹配函数进行测试回归，增加工作量。

现在我们来对其进行改造，首先遵循单一功能原则，把每一项的功能逻辑抽离出来。
```js
function 黄金匹配() {
  console.log('执行黄金段位的匹配')
}
function 钻石匹配() {
  console.log('执行钻石段位的匹配')
}
function 王者匹配() {
  console.log('执行王者段位的匹配')
}
class 王者账号 {
  constructor() {}
  排位匹配(level) {
    if (level === '黄金') {
      黄金匹配()
    }
    if (level === '钻石') {
      钻石匹配()
    }
    if (level === '王者') {
      王者匹配()
    }
  }
}
王者账号.排位匹配('黄金')
```
接下来，我们来遵循开放封闭原则（只新建，不修改），**封装变化**
```js
const 匹配逻辑 = {
  黄金() {
    console.log('执行黄金段位的匹配')
  },
  钻石() {
    console.log('执行钻石段位的匹配')
  },
  王者() {
    console.log('执行王者段位的匹配')
  },
}
class 王者账号 {
  constructor() {}
  排位匹配(level) {
    匹配逻辑[level]()
  }
}
王者账号.排位匹配('黄金')
```
改动之后，后续不管是新增还是删除，我们都不需要去修改`排位匹配`这个函数，只用对`匹配逻辑`进行修改就好。

**策略模式的核心就是把变化算法提取封装好，并是让其可替换。适合表单验证、或者存在大量 if-else 的场景使用。**
## 状态模式
状态模式跟策略模式其实没啥本质上差别，但是多了一个状态的概念，我们还是刚上一个`排位匹配`的代码来示例。
> 王者里有个机制，信誉分，信誉分过低系统会禁止玩家排位功能。我这边稍作修改来当做例子，王者账号这个类里有一个信誉分的参数，信誉分达到80分，黄金段位可以排位，信誉分达到90分钻石段位才可以排位，信誉分达到100分，王者段位才可以排位。现在要求实现这个逻辑？
```js
const 匹配逻辑 = {
  黄金() {
    console.log('执行黄金段位的匹配')
  },
  钻石() {
    console.log('执行钻石段位的匹配')
  },
  王者() {
    console.log('执行王者段位的匹配')
  },
}
class 王者账号 {
  constructor() {
    this.creditPoints = 80
    //80黄金，90钻石，100王者
  }
  排位匹配(level) {
    匹配逻辑[level]()
  }
}
```
通过上面的练习，现在大家应该想到，要把这单个的功能在到`匹配逻辑`里的各项里去，这样后续如果有段位的新增和删除，或者信誉分逻辑的修改，我们都不需要去修改`排位匹配`这个函数，可以减少测试的工作量。

但是这个信誉分的状态怎么拿到呢？现在我们来使用状态模式的思想来改造一下。
```js
class 王者账号 {
  constructor() {
    this.creditPoints = 80
    //80黄金，90钻石，100王者
  }
  匹配逻辑 = {
    that: this,
    黄金() {
      if (this.that.creditPoints >= 80) {
        console.log('执行黄金段位的匹配')
      }
    },
    钻石() {
      if (this.that.creditPoints >= 90) {
        console.log('执行钻石段位的匹配')
      }
    },
    王者() {
      if (this.that.creditPoints >= 100) {
        console.log('执行王者段位的匹配')
      }
    }
  }
  排位匹配(level) {
    匹配逻辑[level]()
  }
}
```
是不是很简单？

**状态模式主要解决的是当控制一个对象状态的条件表达式过于复杂时的情况。把状态的判断逻辑转移到表示不同状态的一系列类中，可以把复杂的判断逻辑简化。**

## 单例模式
> 要求实现一个全局唯一的Modal弹框

这是一道非常经典的单例模式的例子，也是比较常见的面试题。直接上答案了。
```js
const SingleModal = (function() {
  let modal
  // 利用闭包实现单例
  return function() {
    if(!modal) {
        modal = document.createElement('div')
        modal.innerHTML = '全局唯一的Modal'
        modal.style.display = 'none'
        document.body.appendChild(modal)
    }
    return modal
  }
})()
// 创建和显示
const modal = SingleModal()
modal.style.display = 'block'

// 隐藏
const modal = SingleModal()
modal.style.display = 'none'
```
后续每次调`SingleModal()`返回的都是第一次运行时创建的那个Modal弹框。也可以使用类的方式实现单例。
```js
class SingleModal{
  // 这里是定义了一个静态方法，也可以写在类的构造函数里。大家可以自己试着写一下
  static createModal() {
      if (!SingleModal.instance) {
        let modal
        modal = document.createElement('div')
        modal.innerHTML = '全局唯一的Modal'
        modal.style.display = 'none'
        document.body.appendChild(modal)
        SingleModal.instance = modal
      }
      return SingleModal.instance
  }
}
const modal1 = SingleModal.createModal()
const modal2 = SingleModal.createModal()

modal1 === modal2 // true
```

**单例模式的目的就是保障不管多少次的调用，返回的都是同一个实例。**

像`vuex`就是典型的单例实现，所有子组件访问到的store其实都是根组件的那个store实例，修改的都是同一个由`vuex`创建出来的`vue`实例。

## 装饰器模式
