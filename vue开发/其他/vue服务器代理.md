### 服务器代理

vue3.0 可以通过配置 vue.config.js 文档来实现服务器代理

我们想要访问的目标接口地址是 http://t.yushu.im/v2/movie/in_theaters
现在，我们把这串地址的 http://t.yushu.im 这部分用拦截器 /api 替代，也就是说，当服务器启动的时候，在文件中读取到 ‘ /api ’ 这串字符串的时候，会变成 http:localhost/8080/api/v2/movie/in_theaters，而此时路径重写设置为忽略拦截器的名字，也就是说不包含拦截器的名字，因此，访问路径会变成这样，是这样 http:localhost/8080/v2/movie/in_theaters，最后，路径就成功伪装，顺利闯过了浏览器的关卡，就可以正常获取到数据

#### 一 配置 vue.config.js

```javascript
const path = require('path');

module.exports = {
  // 默认输出的路径 就是在当前地址栏后面添加的路径 若为 'ccc' ，则为 http://localhost:8085/ccc/
  publicPath: '/'
  // 不同的环境打不同包名
  outputDir: process.env.NODE_ENV === "development" ? 'devdist' : 'dist', 
  lintOnSave: false,  // 关闭eslint
  productionSourceMap: true,  // 生产环境下css 分离文件
  devServer: {   // 配置服务器
    port: 8086,
    open: true,
    https: false,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {  // 服务器代理相关
      '/api': {
        target: 'http://t.yushu.im',     // 如果使用代理，配置代理的数据库地址
        changeOrigin: true,              // 是否设置同源
        pathRewrite: {                   // 路径重写
          '^/api': ''                    // 选择忽略拦截器里面的单词
        }
      }
    }
  },
  configureWebpack: {  // 覆盖webpack默认配置的都在这里
    resolve: {   // 配置解析别名其中:@代表根目录，@c代表 src/components 文件夹，等
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@a': path.resolve(__dirname, './src/assets'),
        '@c': path.resolve(__dirname, './src/components'),
        '@u': path.resolve(__dirname, './src/utils'),
      }
    }
  }
}
```

#### 二 axios 使用时需要注意:

在 vue.config.js 文件中配置好需要服务器代理访问的地址后，在发送请求的时候，需要在请求的地址前面添加 **/api** 例如 http://t.yushu.im/v2/movie/in_theaters 就会变成 http:localhost/8080/api/v2/movie/in_theaters

```javascript
import axios from 'axios'

// 如果是代理环境，地址后面拼接上 /api
let isApi = ''
if (process.env.VUE_APP_MODE && process.env.VUE_APP_MODE === 'proxy') {
  isApi = '/api'
}

// axios 实例
const request = axios.create({
  baseURL: `${process.env.VUE_APP_URL}${isApi}`,  // 此时的 process.env.VUE_APP_URL 应为 ''
  withCredentials: true,  // 跨域请求时发送cookie
  timeout: 6000
})

// 请求拦截器
request.interceptors.request.use(
  ...
)

// 响应拦截器
request.interceptors.response.use(
  ...
)

export default request
```

### 