# 使用mock.js 生成假数据

安装 `mock.js` 和 `axios`

```javascript
npm install --save-dev mockjs
npm install --save axios
```

### 1 封装 `axios`

`utils` 文件夹下新建 `request.js` 配置 `baseUrl`

```javascript
import axios from 'axios'

// axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8086',
  withCredentials: true, // 跨域请求时发送cookie
  timeout: 6000,
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {

    return config
  },
  (error) => {
    // do something with request error
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {

    return response.data
  },
  (error) => {

    return Promise.reject(error)
  }
)

export default request
```

### 2 封装 `mock.js` 文件

`mock` 文件夹下新建 `mockServer.js`

```javascript
import Mock from "mockjs"

// 自定义返回数据
// import data from './data.json'

Mock.mock('http://localhost:8086/list', {
  code: 0, data:
  {
    'data|20': [
      {
        id: '@id',//随机id
        name: '@name',//随机名称
        nickName: '@last',//随机昵称
        phone: /^1[34578]\d{9}$/,//随机电话号码
        'age|11-99': 1,//年龄
        address: '@county(true)',//随机地址
        email: '@email',//随机邮箱
        isMale: '@boolean',//随机性别
        createTime: '@datetime',//创建时间
        avatar() {
          //用户头像
          return Mock.Random.image('100×100', Mock.Random.color(), '#757575', 'png', this.nickName)
        }
      }
    ]
  }
})
```

### 3 `main.js` 中引入

```javascript
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import './mock/mockServer'

let aa = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");


console.log(aa);
```

#### 4 使用

`home.vue` 中获取数据

```javascript

import request from '../utils/request'

export default {
  name: 'Home',
  components: { Hello },
  async created() {
    try {
      const res = await request('/list')
      console.log('res------', res)
    } catch (error) {}
  },
}
```

至此，我们就能用 `mock.js` 创建假数据

注：`mock.js` 创建假数据不是通过服务器，所以不能在 `Network` 里面查看具体的请求，可以将获取到的数据打印出来