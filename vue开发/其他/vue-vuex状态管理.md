# vue状态管理

```javascript
npm install

npm run serve
npm run build
```

### 准备

如果项目创建的时候已经安装过vuex，直接对 store 文件夹进行配置就可以

如果项目没有安装过vuex，首先应该安装依赖

```javascript
npm install vuex // 安装依赖
```

创建文件 src / store / index.js

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

在main.js 里面把vuex加载到项目里

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

### 使用状态管理

src / store / index.js 里面新建一个数据 count

```javascript
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 100
  },
  mutations: {},
  actions: {},
  modules: {}
});
```

数据创建好之后我们就能在其他组件里面使用到 count 这个数据了，并且会根据 count 的变化实时更新

app.vue 文件中:

```html
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
      <div>直接获取count:{{this.$store.state.count}}</div>
      <div>使用计算数据获取count:{{count_app}}</div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex' // 引入 state
export default {
  computed: {
    ...mapState({
      count_app: state => state.count // 把需要的数据保存在组件中,{{count_app}}直接引用即可
    })
  }
}
</script>
```

### 改变vuex里面的数据

首先在 src / store / index.js中定义好改变数据的方法

注：mutation 和 action 定义的方法都可以对数据进行更改，区别详见：[mutation 和 action](https://www.cnblogs.com/panghu123/p/11747285.html)

使用的时候

```javascript
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 100
  },
  mutations: {
    add_count(state, num) {
      state.count += num
    }
  },
  actions: {
    add_count_action(connect, num) {
      connect.commit('add_count', num)
    }
  },
  modules: {}
});

```

在 app.vue 中使用

```html
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
      <div>直接获取count:{{this.$store.state.count}}</div>
      <div>使用计算属性获取count:{{count_app}}</div>
      <div>
        <button style="border:1px solid #000" @click="btnClick_m">使用mutation使count+10</button>
      </div>
      <div>
        <button style="border:1px solid #000" @click="btnClick_a">使用action使count+20</button>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      count_app: state => state.count
    })
  },
  methods: {
    btnClick_m() {
      this.$store.commit('add_count', 10) // 通过 this.$store.commit 调用mutation里面的方法
    },
    btnClick_a() {
      this.$store.dispatch('add_count_action', 20) // 通过 this.$store.dispatch 调用action里面的方法
    }
  }
}
</script>
```

分别点击按钮 +10 与 +20 可以看到对应的效果变化

### 模块化

所有的数据写在一起会造成数据混乱，所以就需要我们针对某个模块做相对应的状态管理

新建 store / modules / home.js 针对性的管理 home 模块中的数据

```javascript
// home 模块 ----注意：我们只需要把 home 模块的数据和数据操作方法暴露出去，不需要重新创建 vuex对象
export default {
  state: {
    count_home: 500
  },
  mutations: {
    add_count_home(state, num) {
      state.count_home += num
    }
  },
  actions: {
    add_count_home_action(context, num) {
      context.commit('add_count_home', num)
    }
  }
};

```

store / index.js 文件

```javascript
import Vue from "vue";
import Vuex from "vuex";

import home from "./modules/home"  // 引入 home 模块的状态管理

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 100
  },
  mutations: {
    add_count(state, num) {
      state.count += num
    }
  },
  actions: {
    add_count_action(context, num) {
      context.commit('add_count', num)
    }
  },
  modules: {
    home // 引入 home 模块
  }
});

```

在 Home.vue 中

1 直接获取数据需要加上模块 : this.$store.state.**home**.count_home

2 使用计算属性时也要加上模块 : count_home: state => state.**home**.count_home

3 调用改变数据的方法时没有变化

```html
<template>
  <div class="home">
    <div>--------以下为home模块内容---------</div>
    <img alt="Vue logo" src="../assets/logo.png" />
    <div>直接获取count:{{this.$store.state.home.count_home}}</div>
    <div>使用计算属性获取count:{{count_home}}</div>
    <div>
      <button style="border:1px solid #000" @click="btnClick_m">使用mutation使count+10</button>
    </div>
    <div>
      <button style="border:1px solid #000" @click="btnClick_a">使用action使count+20</button>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  computed: {
    ...mapState({
      count_home: state => state.home.count_home  // 使用计算属性时加上模块
    })
  },
  methods: {
    btnClick_m() {
      this.$store.commit('add_count_home', 10)  // 写法不变
    },
    btnClick_a() {
      this.$store.dispatch('add_count_home_action', 20)  // 写法不变
    }
  }
}
</script>

```

分别点击按钮 +10 与 +20 即可看到响应的变化
