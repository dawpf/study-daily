vant 推荐自动按需引入组件

**安装插件**

```javascript
npm i babel-plugin-import -D
```

配置文件

- 在.babelrc 中添加配置

  ```javascript
  {
    "plugins": [
      ["import", {
        "libraryName": "vant",
        "libraryDirectory": "es",
        "style": true
      }]
    ]
  }
  ```

- 对于使用 babel7 的用户，可以在 babel.config.js 中配置

  ```javascript
  module.exports = {
    plugins: [
      ['import', {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      }, 'vant']
    ]
  };
  ```

至此，自动按需引入配置完成

**使用（注意踩坑）**

```html
<template>
  <div class="login_container">
      
    <van-button type="primary">主要按钮</van-button>

    <Swipe>
      <SwipeItem>1</SwipeItem>
      <SwipeItem>2</SwipeItem>
      <SwipeItem>3</SwipeItem>
      <SwipeItem>4</SwipeItem>
    </Swipe>
  </div>
</template>

<script>
import { Button, Swipe, SwipeItem, } from 'vant'

// 注意：引入的组件有两种使用方式 如需使用 van-button 必须要按下面方式重命名组件！
export default {
  components: {
    [Button.name]: Button,
    Swipe,
    SwipeItem,
  },
}
</script>
```

