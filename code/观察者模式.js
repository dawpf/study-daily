// 被观察者对象
class Student {
  constructor(name) {
    this.s_name = name
    this.state = '学习'
    this.observer = []
  }

  // 获取状态的方法
  getter() {
    return this.state
  }

  // 改变状态的同时通过方法通知观察者
  setState(state) {
    this.state = state
    this.notice()
  }

  // 添加观察者
  attash(observer) {
    this.observer.push(observer)
  }

  // 通知观察者
  notice(observer) {
    this.observer.forEach(v => {
      v.sayHello(this.s_name, this.state)
    });
  }
}

// 观察者对象
class Teacher {
  constructor(name) {
    this.t_name = name
  }

  // 被观察者通知观察者执行的方法
  sayHello(name, state) {
    console.log('我是' + this.t_name + ',学生' + name + '现在的状态为:' + state);
  }
}

// 实例化被观察者
stu = new Student('小明')

// 实例化观察者
t1 = new Teacher('王老师')
t2 = new Teacher('张老师')

// 添加观察者
stu.attash(t1)
stu.attash(t2)

// 被观察者触发了改变状态的方法，就会通知到观察者，观察者执行对应的方法
stu.setState('写作业')

