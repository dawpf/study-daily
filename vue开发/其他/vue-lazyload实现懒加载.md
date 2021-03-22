## vue-lazyload实现图片懒加载

### 项目准备
```markdown
npm install
npm run serve
```

### 安装插件

```
npm install vue-lazyload   --save
```

或使用 cdn 引入

```html
<script src="https://unpkg.com/vue-lazyload/vue-lazyload.js"></script>
```

main.js 中引入插件

```javascript
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueLazyload from "vue-lazyload"

// error:加载失败使用的图片
// loading: 加载中使用的图片
Vue.use(VueLazyload, {  
  error: 'http://a2.att.hudong.com/36/48/19300001357258133412489354717.jpg',
  // loading: 'http://img.zcool.cn/community/0195f55972f18ca8012193a342310a.gif',
  loading: require('./assets/lazy.gif') // 若为本地图片需要 require 引入
})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
```

### 使用

img 标签中，使用 `v-lazy` 替换 `src` 即可

```html
<template>
  <div class="home">
    <div v-for="item in imgList">
      <img class="img" v-lazy="item" />
    </div>
  </div>
</template>
```

### 附：原生 `js` 实现懒加载

**思路**：

- [ ] 为 `img` 标签添加属性 `src ` 中存储加载时的图片， `data-src` 里面存储真正的图片地址
- [ ] 通过监听页面的滚动事件，当 `img` 标签滚动到当前视图窗口时，使用 `data-src` 中的地址替换 `src`

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="https://cdn.bootcss.com/jquery/2.1.0/jquery.min.js"></script>
  <style>
    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    .container:after {
      content: "";
      display: block;
      clear: both;
    }

    .container img {
      width: 50%;
      height: 260px;
      float: left;
    }
  </style>
</head>

<body>
  <div class="container">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img4.imgtn.bdimg.com/it/u=951914923,777131061&fm=26&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img1.imgtn.bdimg.com/it/u=637435809,3242058940&fm=26&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img1.imgtn.bdimg.com/it/u=3990342075,2367006974&fm=200&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img1.imgtn.bdimg.com/it/u=1813891576,1754763093&fm=26&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img4.imgtn.bdimg.com/it/u=2539922263,2810970709&fm=200&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img4.imgtn.bdimg.com/it/u=1878067600,3935137756&fm=200&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img3.imgtn.bdimg.com/it/u=85690711,3884201894&fm=26&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img2.imgtn.bdimg.com/it/u=3844233833,3942617167&fm=200&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img0.imgtn.bdimg.com/it/u=1846695025,2515725663&fm=26&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img3.imgtn.bdimg.com/it/u=346230831,1833217134&fm=200&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img5.imgtn.bdimg.com/it/u=3478148120,2683867435&fm=26&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img5.imgtn.bdimg.com/it/u=2298824648,1812234339&fm=200&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img2.imgtn.bdimg.com/it/u=4201594846,4178139206&fm=26&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img2.imgtn.bdimg.com/it/u=484389598,819397330&fm=200&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img1.imgtn.bdimg.com/it/u=3729466012,914166979&fm=26&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img2.imgtn.bdimg.com/it/u=354463615,3836278171&fm=200&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img5.imgtn.bdimg.com/it/u=1831250492,3489827059&fm=200&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img1.imgtn.bdimg.com/it/u=779005622,2247570143&fm=200&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img1.imgtn.bdimg.com/it/u=1968229118,3512711019&fm=26&gp=0.jpg">
    <img src="http://s4.sinaimg.cn/mw690/006uWPTUgy72CNFYNjB93&690" alt="1"
      data-src="http://img2.imgtn.bdimg.com/it/u=1088428253,1150170159&fm=200&gp=0.jpg">
  </div>

  <script>

    // 一开始没有滚动的时候，出现在视窗中的图片也会加载
    start();

    // 当页面开始滚动的时候，遍历图片，如果图片出现在视窗中，就加载图片
    var clock; //函数节流
    $(window).on('scroll', function () {
      if (clock) {
        clearTimeout(clock);
      }
      clock = setTimeout(function () {
        start()
      }, 200)
    })

    function start() {
      $('.container img').not('[data-isLoading]').each(function () {
        if (isShow($(this))) {
          loadImg($(this));
        }
      })
    }

    // 判断图片是否出现在视窗的函数
    function isShow($node) {
      return $node.offset().top <= $(window).height() + $(window).scrollTop();
    }

    // 加载图片的函数，就是把自定义属性data-src 存储的真正的图片地址，赋值给src
    function loadImg($img) {
      $img.attr('src', $img.attr('data-src'));

      // 已经加载的图片，我给它设置一个属性，值为1，作为标识
      // 弄这个的初衷是因为，每次滚动的时候，所有的图片都会遍历一遍，这样有点浪费，所以做个标识，滚动的时候只遍历哪些还没有加载的图片
      $img.attr('data-isLoading', 1);
    }

  </script>
</body>

</html>
```

