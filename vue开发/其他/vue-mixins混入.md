# mixins

混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

混入：即把常用的方法、数据进行集合封装，方便在更多地方进行使用

例如：很多长列表的加载需要 `getData()`、下滑到底部加载下一页数据、表格的搜索、点击页数跳转等，可以使用混入把这些方法进行封装，在不同的页面传入不同的参数公用这些方法

## 使用

`utils/mixins` 下新建 `common-mixins.js`

```javascript
const commonMixins = {
  data() {
    return {
      data_mixins: 'mixins中的data',
    }
  },
  created() {
    console.log('mixins中的created执行了')
  },
  methods: {
    fun1() {
      console.log('mixins中的fun1')
    },
  },
}

export default commonMixins
```

在 `home.vue` 页面进行使用

```html
<template>
  <div class="home" key="home-----------------------------------------------">
    <img
      alt="Vue logo"
      src="../assets/logo.png"
      @click="fun1"
      key="img-----------------------------------"
    />
    <Hello></Hello>
    <div>home组件:{{ data_mixins }}</div>
    <div style="margin-top: 20px">
      <input type="text" v-model="data_mixins" />
    </div>
  </div>
</template>

<script>
import commonMixins from '../utils/mixins/common-mixins'
import Hello from '../components/hello'

import request from '../utils/request'

export default {
  name: 'Home',
  mixins: [commonMixins],
  components: { Hello },
  data() {
    return {
      data_mixins: 'home组件中的data',
    }
  },
  created() {
    console.log('home组件中的created执行了')
  },
  methods: {
    fun1() {
      console.log('home组件中的fun1执行了')
    },
  },
}
</script>
```

## 选项合并

当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。

比如，数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。

```javascript
console.log(this.data_mixins)

// 打印内容： home组件中的data
```

同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子 **之前** 调用。

```javascript
// 两次调用 created 钩子函数 打印结果顺序为：

// mixins中的created执行了
// home组件中的created执行了
```

值为对象的选项，例如 `methods`、`components` 和 `directives`，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。

```javascript
// 点击图片触发点击事件，打印的数据为：

// home组件中的fun1执行了
```

## 全局混入

混入也可以进行全局注册。使用时格外小心！一旦使用全局混入，它将影响 **每一个** 之后创建的 Vue 实例。使用恰当时，这可以用来为自定义选项注入处理逻辑。

请谨慎使用全局混入，因为它会影响每个单独创建的 Vue 实例 (包括第三方组件)。大多数情况下，只应当应用于自定义选项，就像上面示例一样。推荐将其作为  **插件** 发布，以避免重复应用混入。