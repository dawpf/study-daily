### 引入外部css

#### 一 全局使用

main.js：

```javascript
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./app.less"  // 引入全局样式文件

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
```

#### 二 局部引入

```html
<template>
  <div>
    <div class="bgcR">这是一个公共组件</div>
  </div>
</template>

<style lang="less" scoped>
@import './index';  // 引入外部 css 样式文件
</style>
```

