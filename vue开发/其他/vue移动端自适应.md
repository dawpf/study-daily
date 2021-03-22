# vue 移动端项目自适应屏幕

```javascript
npm install
npm run serve
```

### 需求：

vue 移动端项目，需要根据手机屏幕的大小自动适应，避免样式bug，使用插件项目自动转化为 rem 布局，未开始或进行中的项目都可以进行配置

### 实现：

通过对 vue 项目进行配置，使得项目在启动的时候，根据当前设备的屏幕尺寸把尺寸 px 自动转化为 rem ，

如：在iphone6  375宽的标准屏幕下，div的宽高为200px，在iphone6 pluse  414宽的屏幕下，div的宽高就应该自适应变为 414 / 375 * 200 = 220.8px

#### 一 安装依赖

```javascript
npm install postcss-px2rem
```

#### 二 rem.js

项目 public 目录下新建 rem.js

```javascript
const baseSize = 16  // 页面默认字体大小(不做更改)
// 设置 rem 函数
function setRem() {
  // 当前页面宽度相对于 375 宽的缩放比例，可根据自己需要修改。
  const scale = document.documentElement.clientWidth / 375
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}
```

#### 三 vue.config.js 文件配置

vue3.0 将项目配置划到 vue.config.js 这个文件里，更加直观，没有就新建

```javascript
const px2rem = require('postcss-px2rem')

const postcss = px2rem({
  remUnit: 16   //基准大小 baseSize，需要和rem.js中相同(不做更改)
})

module.exports = {
  css: {   // 移动端自适应:css 配置
    loaderOptions: {
      postcss: {
        plugins: [ postcss ]
      }
    }
  }
}
```

#### 四 main.js 配置

```javascript
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// 项目启动时，加载自适应配置
(function () {
  var rem = document.createElement('script');
  rem.src = './rem.js';
  document.body.appendChild(rem)
})()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

```

**注：在页面中需要自适应屏幕的地方，都要使用尺寸来约束如，注明宽高、注明位置（包括字体大小，图片宽高）**

这样，加载页面的时候，vue项目的配置会自动将 px 转化为 rem 为单位，自适应设备屏幕大小

