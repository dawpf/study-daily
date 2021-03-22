import axios from 'axios'

// react初始化项目的时候配置了两个环境 development
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  // baseURL = 'https://easy-mock.bookset.io/mock/5ea55eea326ac86e4360d4fb/example'
  baseURL = '/api'
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'http://t.yushu.im_pro'
}

// axios 实例
const request = axios.create({
  baseURL: baseURL,  // 开发环境/生产环境切换
  withCredentials: true,  // 跨域请求时发送cookie
  timeout: 6000
})

// 请求拦截器
request.interceptors.request.use(
  config => {

    // config 中包含了所有的请求参数，可以在这里对请求参数进行处理，如：添加默认请求参数，扩展管理等
    
    // 添加默认参数
    if (config.params) {
      config.params = {
        apikey: '123456798',
        ...config.params
      }
    }

    console.log('请求传递的参数为',config);

    return config
  },
  error => {
    // do something with request error
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const data = error.response.data
    const status = error.response.status

    // 对不同状态码进行管理
    if (status === 401) {
      console.log('登录已过期');
    } else if (status === 500) {
      console.log('服务器错误');
    }
    return Promise.reject(data.error)
  }
)

export default request