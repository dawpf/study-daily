## vue-transition

点击 [vue过渡动效](https://cn.vuejs.org/v2/guide/transitions.html) 查看更多详情

### 项目准备
```
npm install
npm run serve
```

### 简介

使用 `transition` 给所有路由设置一样的过渡效果，如果你想让每个路由组件有各自的过渡效果，可以在各路由组件内使用 `transition` 并设置不同的 `name`

**思路**：

- [ ] 首先，在全局样式文件中，把过渡动效的样式定义好
- [ ] 然后在具体的组件内部，使用 `transition` 标签包裹 `router-view` 并定义相对应的 `name` 属性
- [ ] 这样，在 `router-view` 里面的组件加载时，就会出现相对应的过渡动效

**在进入/离开的过渡中，会有 6 个 class 切换**。

1. `v-enter`：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。
2. `v-enter-active`：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。
3. `v-enter-to`：**2.1.8 版及以上**定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 `v-enter` 被移除)，在过渡/动画完成之后移除。
4. `v-leave`：定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
5. `v-leave-active`：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
6. `v-leave-to`：**2.1.8 版及以上**定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 `v-leave` 被删除)，在过渡/动画完成之后移除。

**注：对于这些在过渡中切换的类名来说，如果你使用一个没有名字的 `transition`，则 `v-` 是这些类名的默认前缀。如果你使用了 `<transition name="my-transition">`，那么 `v-enter` 会替换为 `my-transition-enter`。**

### 项目结构

```markdown
public
src
|-router
|-views
  |-aaa.vue
  |-bbb.vue
  |-ccc.vue
App.vue
main.js
...
```

### router / index.js

路由结构由外到里为: App - aaa - bbb - ccc

```javascript
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/aaa",
    name: "Aaa",
    component: () => import(/* webpackChunkName: "aaa" */ "../views/aaa.vue"),
    children: [
      {
        path: "bbb",
        name: "Bbb",
        component: () =>
          import(/* webpackChunkName: "bbb" */ "../views/bbb.vue"),
        children: [
          {
            path: "ccc",
            name: "Ccc",
            component: () =>
              import(/* webpackChunkName: "ccc" */ "../views/ccc.vue"),
          }
        ]
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

```

### App.vue

```html
<template>
  <div id="app">
    <div class="one">
      <div>
        <router-link to="/aaa">下一层</router-link>
      </div>
      <h1>第一层</h1>
    </div>
    
    <!-- 为 app 下的子路由 aaa 添加 快进快出 的过渡动效 -->
    <transition name="kuai">
      <router-view></router-view>
    </transition>
  </div>
</template>



<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  
/* 全局样式 */
* {
  padding: 0;
  margin: 0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
  text-align: center;
}

/* app 页面样式 */
.one {
  height: 100%;
  background-color: yellow;
}

/* 以下为提前定义好的过渡样式 */

/* 快进快出 */
.kuai-enter-active,
.kuai-leave-active {
  transition: all 0.3s;
}
.kuai-enter,
.kuai-leave-to {
  transform: translateX(100%);
}

/* 慢进慢出 */
.man-enter-active,
.man-leave-active {
  transition: all 1s;
}
.man-enter,
.man-leave-to {
  transform: translateX(100%);
}

/* 淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: all 1s;
  opacity: 1;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
  
...

</style>
```

### aaa.vue

```html
<template>
  <div class="two">
    <router-link to="/aaa/bbb">下一层</router-link>
    <router-link to="/">返回</router-link>
    <h1>第二层</h1>
    
    <!-- 为 aaa 下的子路由 bbb 添加 慢进慢出 的过渡动效 -->
    <transition name="man">
      <router-view></router-view>
    </transition>
  </div>
</template>


<style scoped>
.two {
  background-color: tomato;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
```

### bbb.vue

```html
<template>
  <div class="three">
    <router-link to="/aaa/bbb/ccc">下一层</router-link>
    <router-link to="/aaa">返回</router-link>
    <h1>第三层</h1>
    
    <!-- 为 bbb 下的子路由 ccc 添加 淡入淡出 的过渡动效 -->
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<style scoped>
.three {
  background-color: #ffe69f;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
```

### ccc.vue

```html
<template>
  <div class="four">
    <router-link to="/aaa/bbb">返回</router-link>
    
    <!-- 最后一层页面 -->
    <h1>第四层</h1>
  </div>
</template>

<style scoped>
.four {
  background-color: greenyellow;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
```

至此，自定义过渡动效完成！