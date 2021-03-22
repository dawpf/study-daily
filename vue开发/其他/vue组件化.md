## 组件封装

```
npm install

npm run serve
npm run build
```

### 一 通用组件

通用组件：即为在各个页面均能使用的公共组件，例如navbar、input、button等

封装 button 如下：

新建 src / components / button 文件夹，内含 index.vue 和 index.less 文件

index.vue：

```html
<template>
  <span class="container" @click="btnClick" :style="getStyle()">
    <slot></slot>  // 插槽用于展示组件内容（即按钮的文本:按钮123）
  </span>
</template>

<script>
export default {
  props: {
    contentStyle: {
      type: String,
      default: ''
    }
  },
  created() {},
  methods: {
    // 调用传递下来的按钮点击方法
    btnClick() {
      this.$emit('btnClick')
    },
    // 更新按钮样式
    getStyle() {
      return this.contentStyle
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index');  // 引入外部 css 样式文件
</style>
```

使用：

```html
<template>
  <div class="home">
    <Button 
       contentStyle="color:yellow;background-color:black" 
       @btnClick="btnClick"
     >按钮123</Button>
  </div>
</template>

<script>
import Button from '@/components/button/index.vue'

export default {
  name: 'Home',
  components: { Button },
  methods: {
    btnClick() {
      console.log('在父组件内点击了按钮')
    }
  }
}
</script>
```

### 二 展示型组件

展示型组件：即为在某些页面使用，用来展示某些特定数据结构的数据，例如：bookItem、bookDetail 等

只需要在自组件使用 props 属性获取传递下来的数据，然后在组件内展示即可

新建 src / components / bookitem 内含 index.vue 和 index.less 文件

index.vue ：

```html
<template>
  <div class="container">
    <div class="title tac">书名:{{bookData.bookName}}</div>
    <div class="author tac">作者:{{bookData.author}}</div>
  </div>
</template>

<script>
export default {
  props: {
    bookData: {
      type: Object,
      default: () => {
        return {
          bookName: '',
          author: ''
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index');  // 引入外部样式文件，类名 tac 从公共样式文件里面引入
</style>
```

使用：

```html
<template>
  <div class="home">
    <div
      style="margin-top:10px;float:left;width:31%;margin-left:6px"
      v-for="item in bookList"
      :key="item.id"
    >
      <BookItem :bookData="item"></BookItem>
    </div>
  </div>
</template>

<script>
import BookItem from '@/components/bookitem/index.vue'

export default {
  name: 'Home',
  components: { BookItem },
  data() {
    return {
      bookList: [
        {
          id: 1,
          bookName: 'book1',
          author: 'zs1'
        },
        {
          id: 2,
          bookName: 'book2',
          author: 'zs2'
        },
        {
          id: 3,
          bookName: 'book3',
          author: 'zs3'
        }
      ]
    }
  },
  methods: {}
}
</script>
```

