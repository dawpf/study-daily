// 观察者  模式
// => 让 观察者 看着 被观察者, 只要数据改变了
// => 就让 观察者 做一些事情
// observers  观察者

// 被观察者
class student {
  constructor(name) {
    this.name = name
    //最开始的状态
    this.state = '学习'
    // 数组 中放入观察者  一旦被观察者状态发生改变  就让 观察者 做一些事情
    this.observers = []
  }

  // 改变状态
  setState(state) {
    this.state = state
    //只要状态发生变化 通知观察者  数据改变了
    this.noticy()
  }

  // 获取状态
  getState() {
    return this.state
  }

  // 添加  观察者
  attach(observer) {
    this.observers.push(observer)
  }

  // 通知  观察者 => 被观察者  状态改变了
  noticy() {
    this.observers.forEach(item => item.jiaojiazhang(this.name, this.state))
  }
}


// 观察者
class teacher {
  constructor(name) {
    this.name = name
  }
  jiaojiazhang(name, state) {
    console.log(`我是  ${this.name}  因为  ${name}  在  ${state},我要叫家长 `)
  }
}

// 被观察者
let s = new student('小明')
console.log(s)//student {name: "小明", state: "学习", observers: Array(0)}

// 添加  观察者
let ob1 = new teacher('班主任')
let ob2 = new teacher('教导主任')

console.log(ob1)
console.log(ob2)

s.attach(ob1)
s.attach(ob2)


//先获取最开始的状态
console.log(s.getState())
// 状态改变    改变后观察者 直接执行方法
s.setState('上课吃辣条')
//状态改变后的状态
console.log(s.getState())
