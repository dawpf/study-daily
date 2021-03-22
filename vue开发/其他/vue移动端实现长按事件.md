## vue-mobile-longtouch

### 项目准备
```
npm install
npm run serve
```

使用 vue 框架，在处理移动端项目的时候会出现 **长按事件** 

### 实现思路

- [ ] 给需要操作的 dom 元素添加方法 `touchstart` `touchend` `touchmove` 对应点击开始 点击结束 手指移动
- [ ] 在 `touchstart` 点击开始的时候设置定时器，在指定时间内如果不做其他操作就视为 **长按事件**，执行 **长按事件** 的同时需要设定当前不是 **单击事件**，以防止`touchend` 执行的时候同时出现 **长按事件** 和 **单击事件**
- [ ] 在 `touchend ` 里面清除定时器，并判断是不是 **单击事件**
- [ ] 在 `touchmove` 里面清除定时器，并设定当前不是 **单击事件**

### Home.vue

```html
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div @touchstart="gotouchstart" @touchmove="gotouchmove" @touchend="gotouchend" class="div">按钮</div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 手指按下
    gotouchstart() {
      window.isClick = true
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(function() {
        console.log('在这里执行长按事件')
        window.isClick = false
      }, 500)
    },
    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gotouchend() {
      clearTimeout(this.timeOut)
      if (window.isClick) {
        console.log('在这里执行点击事件')
      }
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gotouchmove() {
      // console.log('手指移动了')
      clearTimeout(this.timeOut)
      window.isClick = false
    }
  },
  // 项目销毁前清除定时器
  beforeDestroy() {
    clearTimeout(this.timeOut)
  }
}
</script>

<style scoped>
.div {
  margin: 0 auto;
  width: 100px;
  height: 100px;
  line-height: 100px;
  border: 1px solid #000;
}
</style>

```

**注**：为什么使用 `window.isClick` 而不是使用 `data` 对应的 `this.isClick`，因为使用 `this.isClick` ，执行到 `gotouchend` 时并不能立即获取在定时器中的设置的 `isClick` 的最新值，会导致执行结果同时触发了 **长按事件** 和 **点击事件**

**至此，vue 移动端 长按事件 实现**

完善：在 **按下 - 500ms** 之间的状态可以进行处理，可选择 **执行点击事件(当前)** 或者 **不做其他操作** 等

