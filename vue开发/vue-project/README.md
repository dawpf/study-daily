# Vue项目

## 1 项目准备

```javascript
npm install -g @vue/cli		// 安装 vue 脚手架

vue create my-vue			// 创建 vue 项目，可选配置路由、vuex等
cd my-vue					// 进入项目文件夹
yarn serve					// 启动项目
```

若使用 `eslint+prettier`  进行代码格式校验，当因为报错 `'xxxxx' is defined but never used`  而不能正常渲染的时候，可以在项目根目录下 `.eslintrc.js`  文件中添加一行

```javascript
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "off"  // 阻止'xxxxx' is defined but never used 报错不能渲染
  }
};

```

## 2 项目结构

```javascript
public			// index.html
src-assets		// 静态资源
   -components	// 组件
   -router		// 路由设置
   -store		// 状态管理 vuex
   -views		// 页面
      -home		// 主页面(相当于初始化时的页面的容器)
	  -user		// home页面下的user子页面
	  -news		// home页面下的news子页面
	  -login	// 登录页面
	  -not-fount// 路由不匹配时的页面
   -App.vue		// 项目根组件
   -main.js		// 项目入口文件
```

## 3 配置路由

### 1 模块化路由配置

`views` 文件夹下新建 `home/index.vue`  `user/index.vue`   `login/index.vue`  三个文件，内容类似于

```html
<template>
  <div class="home_container">
    <div>这是home主页面 {{ msg }}</div>
    <router-view />

    <div style="margin-top:50px">
      <button class="btn" @click="goPage('User')">跳转到user</button>
      <button class="btn" @click="goPage('News')">跳转到News</button>
    </div>
    <div style="margin-top:20px">
      <button class="btn" @click="goPage('Login')">跳转到login</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "home页面的数据"
    };
  },
  methods: {
    goPage(val) {
      this.$router.push({ name: val, query: { id: "1" } });
    }
  }
};
</script>

<style lang="less" scoped>
.home_container {
  background-color: yellow;
  padding: 20px;
  .btn {
    width: 100px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border: 1px solid #000;
  }
}
</style>

```

`router` 文件夹下，新建 `modules/home.js`  模块化开发，配置home相关页面的路由

```javascript
// home 模块路由

const HomeRoute = {
  // 注意：返回的格式是一个对象，不是一个数组！！
  path: "/",
  name: "Home",
  component: () => import("../../views/home/index.vue"),
  redirect: "/user",
  children: [
    {
      path: "user",
      name: "User",
      component: () =>
        import(/* webpackChunkName: "user" */ "../../views/user/index.vue"),
      meta: {
        title: "user页面"
      }
    },
    {
      path: "news",
      name: "News",
      component: () =>
        import(/* webpackChunkName: "news" */ "../../views/news/index.vue"),
      meta: {
        title: "new页面"
      }
    }
  ]
};

export default HomeRoute;

```

然后在 `router/index.js` 中引入 `home.js`

```javascript
import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./modules/home.js";

Vue.use(VueRouter);

const routes = [
  Home,
  {
    path: "login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login/index.vue"),
    meta: {
      title: "网页标题"
    }
  },
  {
    path: "/404",
    name: "NotFound",
    component: () =>
      import(/* webpackChunkName: "notFound" */ "../views/not-found/index.vue")
  },
  {
    path: "*",
    redirect: "/404"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

// 前置路由守卫--可用于登录页跳转
router.beforeEach((to, from, next) => {
  // console.log('to', to)
  // console.log('from', from)
  // if (to.meta.title) {
  //   document.title = to.meta.title
  // }
  document.title = to.meta.title || "默认网站标题";
  next();

  // next();
});

export default router;

```

### 2 路由跳转及参数获取

`home` 页面跳转到 `user` 页面：

**注意**：官方文档有备注，使用 `this.$router.push( { path:'/user' , params:{id:123} } )` 时，`params` 不生效，需要把 `prams` 替换为 `query`，导航栏路径里面会显示参数信息

或者使用 `this.$router.push( { name:'路由配置的name' , params:{id:123} } )`  这种形式来进行传递参数

```javascript
1.  不带参数
 
this.$router.push('/')
this.$router.push({name:'User'})
this.$router.push({path:'/user'})
 

2. query传参 
 
this.$router.push({name:'User',query: {id:'1'}})
this.$router.push({path:'/user',query: {id:'1'}})
 
// html 取参  $route.query.id
// script 取参  this.$route.query.id
 

3. params传参
 
this.$router.push({name:'User',params: {id:'1'}})  // 只能用 name
 
// 路由配置 path: "/user/:id" 或者 path: "/user:id" ,
// 不配置path ,第一次可请求,刷新页面id会消失
// 配置path,刷新页面id会保留
 
// html 取参  $route.params.id
// script 取参  this.$route.params.id
 
 
 
4. query和params区别
query类似 get, 跳转之后页面 url后面会拼接参数,类似?id=1, 非重要性的可以这样传, 密码之类还是用params刷新页面id还在
 
params类似 post, 跳转之后页面 url后面不会拼接参数 , 但是刷新页面id 会消失
```

**至此，一个完整的 `vue` 路由就配置完成**

## 4 状态管理 `vuex`

### 1 准备

如果项目创建的时候已经安装过 `vuex`，直接对 `store` 文件夹进行配置就可以

如果项目没有安装过 `vuex`，首先应该安装依赖

```javascript
npm install vuex // 安装依赖
```

创建文件 `src/store/index.js`

```javascript
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},  // vuex里面存储的数据
  mutations: {}, // vuex存储的操作数据的方法
  actions: {}, // vuex存储的操作数据的方法
  modules: {} // 项目数据模块化（如：home模块的数据及操作方法、about模块的数据及操作方法，等）
});
```

在 `main.js` 里面把 `vuex` 加载到项目里

```javascript
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store"; // 加载状态管理

Vue.config.productionTip = false;

new Vue({
  router,
  store, // 应用状态管理
  render: h => h(App)
}).$mount("#app");
```

### 2 使用及模块化

所有的数据写在一起会造成数据混乱，所以就需要我们针对某个模块做相对应的状态管理，配置 `login` 页面的数据，实现累加器

注：`mutation` 和 `action` 定义的方法都可以对数据进行更改，区别详见：[mutation 和 action](https://www.cnblogs.com/panghu123/p/11747285.html)

新建 `store/modules/login.js` 针对性的管理 `login` 模块中的数据

```javascript
// login 模块 ----注意：我们只需要把 login 模块的数据和数据操作方法暴露出去，不需要重新创建 vuex对象
export default {
  state: {
    count_login: 500
  },
  mutations: {
    add_count_login(state, num) {
      state.count_login += num;
    }
  },
  actions: {
    add_count_login_action(context, num) {
      context.commit("add_count_login", num);
    }
  }
};
```

`src/store/index.js` 中把 `login` 页面的数据管理进行配置

```javascript
import Vue from "vue";
import Vuex from "vuex";

import login from "./modules/login";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { login }
});

```

在 `login` 页面中

1 直接获取数据需要加上模块 : `this.$store.state.login.count_login`

2 使用计算属性时也要加上模块 : `count_login: state => state.login.count_login`

```html
<template>
  <div class="login_container">
    这是login页面
    <div>直接获取count:{{ this.$store.state.login.count_login }}</div>
    <div>使用计算属性获取count:{{ count_login }}</div>

    <div style="margin-top:10px">
      <button class="btn" @click="add">累加按钮</button>
    </div>
    <div style="margin-top:50px">
      <button class="btn" @click="goPage('Home')">跳转到home</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      msg: "login页面的数据"
    };
  },
  computed: {
    ...mapState({
      count_login: state => state.login.count_login // 使用计算属性时加上模块
    })
  },
  methods: {
    goPage(val) {
      this.$router.push({ name: val, query: { id: "1" } });
    },
    add() {
      // 两种写法都可以
      this.$store.commit("add_count_login", 10); // 写法不变（不需要加.login什么的）
      // this.$store.dispatch("add_count_login_action", 20); // 写法不变
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: red;
  padding: 20px;
  .btn {
    width: 100px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border: 1px solid #000;
  }
}
</style>
```

**至此，`vuex` 的基本使用及模块化开发，完成**

## 5 二次封装 `axios`

### 1 配置 `axios`

```javascript
yarn add axios
```

首先，我们需要区分 开发环境、生产环境，在 `main.js` 中可以进行查看

```javascript
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// 使用 process.env 在控制台可以打印当前环境为 development 还是 product 
console.log("process.env", process.env);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

```

新建 `src/utils/request.js`

```javascript
import axios from "axios";
// import { getToken } from "@/utils/auth";

// 配置 baseURL
let baseURL;
if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
  baseURL = "/api"; // 开发环境的地址
} else if (
  process.env.NODE_ENV &&
  process.env.NODE_ENV === "production"
) {
  baseURL = "生产环境的地址";
}

// axios 实例
const request = axios.create({
  baseURL, // 开发环境/生产环境/使用代理 切换
  withCredentials: true, // 跨域请求时发送cookie
  timeout: 6000
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // config 中包含了所有的请求参数，可以在这里对请求参数进行处理，如：添加默认请求参数，扩展管理等

    // 添加 token
    // if (getToken()) {
    //   config.headers["Authorization"] = getToken();
    // }
    // 添加默认参数
    if (config.params) {
      config.params = {
        apikey: "123456798",
        ...config.params
      };
    }

    return config;
  },
  error => {
    // do something with request error
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    // const res = response.data

    // // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
    return response.data;
  },
  error => {
    const data = error.response.data;
    const status = error.response.status;

    // 对不同状态码进行管理
    if (status === 401) {
      console.log("登录已过期");
    } else if (status === 500) {
      console.log("服务器错误");
    }
    return Promise.reject(data.error);
  }
);

export default request;
```

### 2 模块化管理请求

新建 `src/utils/service.js` 用于管理所有请求的地址

```javascript
export default {
  login_data: "/login",
  user_data: "/user"
};
```

新建 `src/api` 文件夹，在里面新建 `login.js` 用于处理 `login` 页面的数据请求

```javascript
import request from "../utils/request";
import Service from "../utils/service";

/**
 * 获取login页面的数据
 */
export function getLoginData(params) {
  return request.get(Service.login_data, {params});
}

```

在 `login` 页面的使用：

```html
<script>
import { getLoginData } from "../../api/login";
export default {
  ...,
  created() {
    getLoginData();
  },
  ...
</script>
```

**至此，`axios` 的 二次封装及模块化请求数据，完成**

## 6 环境变量及反向代理

### 1 项目配置

`vue` 的项目配置需在根目录下新建 `vue.config.js` ，在里面对项目进行配置

```javascript
const path = require("path");

module.exports = {
  // 默认输出的路径 就是在当前地址栏后面添加的路径 若为 'ccc' ，则为 http://localhost:8085/ccc/
  publicPath: "/",
  // 不同的环境打不同包名
  outputDir: process.env.NODE_ENV === "development" ? "devdist" : "dist",
  lintOnSave: false, // 关闭eslint
  productionSourceMap: true, // 生产环境下css 分离文件
  devServer: {
    // 配置服务器
    port: 8086,
    open: true,
    https: true,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      // 服务器代理相关
      "/api": {
        target: "https://api.uuseesee.com", // 如果使用代理，配置代理的数据库地址
        changeOrigin: true, // 是否设置同源
        pathRewrite: {
          // 路径重写
          "^/api": "" // 选择忽略拦截器里面的单词
        }
      }
    }
  },
  configureWebpack: {
    // 覆盖webpack默认配置的都在这里
    resolve: {
      // 配置解析别名其中:@代表根目录，@c代表 src/components 文件夹，等
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@a": path.resolve(__dirname, "./src/assets"),
        "@c": path.resolve(__dirname, "./src/components"),
        "@u": path.resolve(__dirname, "./src/utils")
      }
    }
  }
};

```

**注意：**

在使用反向代理时，需根据配置对请求地址进行 修改，如上面配置，则需要在请求时，把请求的基准地址配置为 `/api`

### 2 测试

我们设置了请求数据的目标地址为 `https://api.uuseesee.com` 在 `login` 页面中：

```html

<script>
import { postUuLoginData } from "../../api/login";
export default {
  created() {
    // 反向代理测试
    const payLoad = {
      appId: "",
      channel_id: 4,
      marketChannel: "",
      osType: "1",
      packageName: "",
      phoneModel: "",
      product: "2",
      sign: "c8cd9b3d6b6b9428ce6a6684955d7701",
      sysVer: "",
      time: "1604565004",
      token: "",
      udid: "",
      ver: "3.1.0"
    };
    postUuLoginData(payLoad);
  }
};
</script>

```

**至此，我们对 `vue` 项目进行反向代理及环境配置，完成**

## 7 移动端自适应

**说明：**

通过对 `vue` 项目进行配置，使得项目在启动的时候，根据当前设备的屏幕尺寸把尺寸 `px` 自动转化为 `rem` ，

如：在 `iphone6`  375宽的标准屏幕下，`div` 的宽高为 `200px`，在 `iphone6 pluse`  414宽的屏幕下，`div` 的宽高就应该自适应变为 `414 / 375 * 200 = 220.8px`

一 安装依赖

```javascript
npm install postcss-px2rem
```

**`rem.js` 配置**

项目 public 目录下新建 `rem.js`

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

 **`vue.config.js` 文件配置**

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

**`main.js` 配置：**

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

这样，加载页面的时候，`vue` 项目的配置会自动将 `px` 转化为 `rem` 为单位，自适应设备屏幕大小

**至此，移动端自适应配置，完成**