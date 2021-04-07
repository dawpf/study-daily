// 发布-订阅模式

// 定义发布消息
function message1(data) { console.log('这是message1函数', data); }
function message2(data) { console.log('这是message2函数', data); }
function message3(data) { console.log('这是message3函数', data); }
function message4(data) { console.log('这是message4函数', data); }
function message5(data) { console.log('这是message5函数', data); }
function message6(data) { console.log('这是message6函数', data); }



class Observer {
  constructor() {
    this.message = []
  }
  // 订阅
  on(type, fun) {
    if (!this.message[type]) {
      this.message[type] = []
    }
    this.message[type].push(fun)
  }
  // 取消订阅
  off(type, fun) {
    if (!this.message[type]) return
    this.message[type] = this.message[type].filter(v => {
      return v != fun
    })
  }
  // 发布事件
  emit(type, val) {
    const data = {
      type,
      data: val
    }
    if (!this.message[type]) return
    this.message[type].forEach(v => {
      v(data)
    });
  }
}

// 实例化发布者
const ob1 = new Observer()

// 发布者添加消息
ob1.on('type_a', message1)
ob1.on('type_a', message2)
ob1.on('type_a', message3)
ob1.on('type_a', message4)
ob1.on('type_b', message5)
ob1.on('type_b', message6)

// 实例化两个订阅者
const subscriber1 = {
  name: '小明',
  boo: true,
  arr: [1, 2, 3]
}
const subscriber2 = {
  name: '小红',
  boo: false,
  arr: [4, 5, 6]
}

ob1.emit('type_a', subscriber1)
ob1.emit('type_b', subscriber2)

console.log('-----------------------------');

ob1.off('type_a', message1)
ob1.off('type_b', message6)

ob1.emit('type_a', subscriber1)
ob1.emit('type_b', subscriber2)


