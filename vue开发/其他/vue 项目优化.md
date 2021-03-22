### vue 项目优化

#### 一 路由懒加载

```javascript
component: () => import(/* webpackChunkName: "about1" */ "../views/About.vue")
```

**注**：/* webpackChunkName: "about" */  是可以被解析的，这表示打包后路由文件就叫 **about1.js**，打包之后about.vue 的 js代码 提取到 `about1.[hash].js` 上，减少入口js文件的体积，提高加载性能

#### 二 prefetching 预加载

prefetch预加载不会影响性能，但是会产生流量

```markdown
prefetch 是一种 resource hint，用来告诉浏览器在页面加载完成后，利用空闲时间提前获取用户未来可能会访问的内容。
例如：vue3.0创建项目后，打开首页的时候会发现，about页面的路由也加载了，这是prefetching预加载的体现
```

**按需预加载**的实现：全局关闭预加载，在需要预加载的页面进行配置

vue.config.js 中配置：

```javascript
module.exports = {
  chainWebpack: config => {
    config.plugins.delete('prefetch')  // 关闭预加载
  }
}
```

路由页面配置

```javascript
component: () => import(/* webpackPrefetch: true */ "../views/About.vue")
```

#### 三 preloading 优先加载

preloading用于提高资源加载的优先级，当页面开始加载时，我们总是想核心的代码或资源得到优先处理，因此可以通过preloading提高优先级

```javascript
import(/* webpackPreload: true */ "../views/About.vue");
```

但是：错误的使用webpackPreload实际上会影响性能，因此要谨慎使用

