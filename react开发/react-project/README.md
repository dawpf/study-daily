# React 项目

## 1 项目准备

```javascript
npm install -g create-react-app  // 全局安装react脚手架

create-react-app demo  // 使用脚手架创建react项目

cd demo
yarn start  // 进入项目文件夹，启动项目
```

## 2 项目结构

```javascript
app.css   		// 样式文件
App.js     		// 项目初始化的时候自动创建的一个跟组件
App.test.js		// 测试文件
index.css		// 样式文件
index.js		// 项目入口文件（重要！）
logo.svg		// logo
...
```

可以在项目搭建成功后，`src` 文件下只保留 `index.js` 入口文件，后续的都可以自己进行配置

## 3 配置页面路由

`src` 文件夹下新建 `pages` 文件夹，后面写到的页面都可以放在里面（个人习惯，也可以都放在 `aa` 文件夹）

`pages` 文件夹下新建页面

- `home/index.js`   项目主页面的容器，相当于项目初始化时自动创建的 `app.js` 文件
- `user/index.js`    主页面下的一个分页面
- `login/index,js`   登陆页面

页面格式如下：

```javascript
import React from "react"

class MyPage extends React.Component{
    render(){
        return(
        	<div>这是我的页面</div>
        )
    }
}

export default MyPage
```

### 1 路由配置

- 安装依赖 `yarn add react-router-dom`

- `pages` 文件夹下创建 `router/index.js` 页面

- 使用插件进行懒加载 `yarn add react-loadable`  （可省略）

- `router/index.js`  页面配置

  ```javascript
  import React from 'react'
  import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
  import Loadable from "react-loadable"
  
  function loading () {
    return (
      <div>loading....</div>
    )
  }
  
  const Home = Loadable({
    loading: loading,
    loader: () => import('../pages/home')
  })
  const Login = Loadable({
    loading: loading,
    loader: () => import('../pages/login')
  })
  const User = Loadable({
    loading: loading,
    loader: () => import('../pages/user')
  })
  
  class MyRouter extends React.Component {
    render () {
      return (
        <Router>
          
          <Switch>
            <Route path='/' component={(props) => {
              return (
                <Home>
                  <Route path='/home/user' exact component={User}></Route>
                </Home>
              )
            }} />
            <Route path='/login' component={Login} />
            <Route path="*" component={NotFound} />
          </Switch>
  
          <li><Link to='/'>home页面</Link></li>
          <li><Link to='/login'>login页面</Link></li>
        </Router>
      )
    }
  }
  
  export default MyRouter
  
  /*
  其中：
  exact 表示精确匹配，即：路径为 /home/user 时才会跳转到 user 页面
  home 页面若不加 exact ，则在跳转 /home/user111 时不会跳转到 user 页面，但是会跳转在 home 页面
  */
  ```

- 修改入口文件 `index.js`

  ```javascript
  import React from 'react';
  import ReactDOM from 'react-dom';
  import './index.css';
  // import App from './App';
  import MyRouter from './router/index'
  import reportWebVitals from './reportWebVitals';
  
  ReactDOM.render(
  
    // 去除严格模式,处理控制台报错
  
    <MyRouter />
    ,
    document.getElementById('root')
  );
  
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
  ```

- 此时我们在页面里面已经能够通过点击  `home`  或者  `login`  来进行页面跳转，也可以在地址栏里面输入 `/home/user`  来跳转到  `user`  页面，页面路由及子路由配置 **完成**

### 2 路由页面提取

路由全部写在一个文件内过于繁琐，我们可以将路由进行提取，方便管理

`router/index.js`  路由文件修改

```javascript
import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import routes from './route'
// import Loadable from "react-loadable"

// import NotFound from "../pages/notFound"
// function loading () {
//   return (
//     <div>loading....</div>
//   )
// }

// const Home = Loadable({
//   loading: loading,
//   loader: () => import('../pages/home')
// })
// const Login = Loadable({
//   loading: loading,
//   loader: () => import('../pages/login')
// })
// const Board = Loadable({
//   loading: loading,
//   loader: () => import('../pages/board')
// })

class MyRouter extends React.Component {
  render () {
    return (
      <Router>
        <Switch>

          {
            routes.map((router, key) => {
              if (undefined !== router.children && router.children.length) {
                return (<Route key={key} path={router.path} exact={router.exact} 		
        		component={(props) => {
                  return (<router.component>
                    {
                      router.children.map((children, key2) => {
                        return <Route 
                      			path={children.path} 
                      			key={key2} 
                      			exact={children.exact} 
                      			{...props} 
                      			component={children.component}
                      			/>
                      })
                    }
                  </router.component>)

                }} />)
              } else {
                return (
                    <Route 
                    	key={key} 
						path={router.path} 
						exact={router.exact} 
						component={router.component}
					/>)
              }

            })
          }

          {/* <Route path='/' component={(props) => {
            return (
              <Home>
                <Route path='/home/board' exact component={Board}></Route>
              </Home>
            )
          }} />

          <Route path='/login' component={Login} />
          <Route path="*" component={NotFound} /> */}

        </Switch>

        <li><Link to='/'>home页面</Link></li>
        <li><Link to='/login'>login页面</Link></li>

      </Router>
    )
  }
}

export default MyRouter
```

新增  `router/route.js`

```javascript
import Loadable from 'react-loadable'
import React from 'react'

import NotFound from '../pages/notFound'

function Loading () {
  return <div>Loading</div>
}

const Home = Loadable({
  loading: Loading,
  loader: () => import('../pages/home')
});
const Login = Loadable({
  loading: Loading,
  loader: () => import('../pages/login')
});
const User = Loadable({
  loading: Loading,
  loader: () => import('../pages/user')
});

const routes = [
  {
    path: '/login',
    exact: false,
    component: Login
  },
  {
    path: '/',
    exact: true,
    component: Home,
    children: [
      {
        path: '/home/user',
        exact: true,
        component: User
      }
    ]
  },
  {
    path: '*',
    exact: false,
    component: NotFound
  }
]

export default routes;

/*
通过配置文件，就可以方便的对路由进行管理及维护，也可以进行模块化管理，比如新建 package.js，里面导出package相关的路由配置，在route.js中进行导入后 ...package 进行展开即可
*/
```

### 3 路由跳转及携带参数

定义好路由之后，跳转路由的时候我们可以采用下面的方法进行路由之间的跳转及参数获取

```javascript
// <button onClick={this.userClick.bind(this)}>login页面的按钮</button>
// 注：在定义事件的时候需在事件后面添加this指向

// 方式1：路由表配置：参数地址栏显示
<Route path="/login/:id" component={Login} />
this.props.history.push('/login/2')
// 获取传递过来的所有数据
this.props.match.params

// 方式2：query方法：参数地址栏不显示，刷新地址栏，参数丢失
this.props.history.push({ pathname: '/login', query: { name: 'user页面传递过去的' } })
// 获取页面传递过来的所有数据
this.props.location.query

// 方式3：state方法：参数地址栏不显示，刷新地址栏，参数不丢失，但是该方法只支持BrowerRouter，不支持HashRouter
this.props.history.push({ pathname: '/login', state: { name: 'user页面传递过去的' } })

// 获取页面传递过来的所有数据
this.props.location.state
```

如  `user.js`  页面

```javascript
import React from "react"
import './index.less'  // 引入样式文件

class User extends React.Component {
  componentDidMount(){
    console.log('this.props.location',this.props.location);
  }
  userClick(){
    this.props.history.push({ pathname: '/login', state: { name: 'user页面传递过去的' } })
  }
  render() {
    return (
      <div className='user_container'>
        <h2>这是home页面的子页面 user 页面</h2>
        <button className='user_btn' onClick={this.userClick.bind(this)}>login页面的按钮</button>
      </div>
    )
  }
}

export default User
```

## 4 使用 `sass`

`react` 脚手架已经为我们配置好了 `sass` 即使：已经预下载了  `sass-loader` ，我们只需要下载另外一个依赖 `node-sass` 即可

### 1 安装依赖

```javascript
yarn add node-sass   // 安装 node-sass 依赖

// 注：在安装完依赖，并且正确书写 css 文件后，若页面报错 
// Node Sass version 5.0.0 is incompatible with^4.0.0
// 即是 node-sass版本与当前 sass-loader 本版不兼容，需要使用对用的版本进行替换

// yarn remove node-sass 
// yarn add node-sass@4.14.1

// 若此时依赖不能正常安装，尝试删除本地项目文件夹下 node_modules 文件夹下 node-sass 文件后重新安装
```

**安装完依赖后把项目进行重启**

### 3 嵌套式写法

`sass` 文件和 `less` 格式相同，`pages/news/index.scss` 

```less
.container_news {
  background-color: pink;
  .boxx {
    width: 150px;
    height: 150px;
    text-align: center;
    line-height: 150px;
    background-color: greenyellow;
    margin: 0 auto;
  }
}

```

### 4 样式模块化

相同的类名，在渲染项目的时候可能会造成项目样式出现问题，所以需要对样式进行模块化处理

`.scss` 文件内容无变化，只需要把文件名改为：`index.modules.scss`

`news.js` 文件如下

```javascript
import React from 'react'

import style from './index.module.scss'

class News extends React.Component{
  render(){
    return(
      <div className={style.container_news}>
        <h2>这是home里面的news页面</h2>
        <div className={style.boxx}>盒子</div>
      </div>
    )
  }
}

export default News
```

至此，`react` 项目中使用 `sass` 进行编译，及对样式进行模块化开发，完成

## 5 使用 `less`

### 1 安装依赖

```javascript
yarn add less less-loader -D  // 安装依赖
yarn eject    // webpack配置导出，进行自定义配置
```

### 2 项目配置

修改  `webpack`  配置，在  `webpack.config.js`  文件中添加如下设置：

```javascript
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// 增加less编译
{
  test: lessRegex,
  exclude: sassModuleRegex,
  use: getStyleLoaders(
    {
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap,
    },
    'less-loader'
  ),
  sideEffects: true,
},
{
  test: lessModuleRegex,
  use: getStyleLoaders(
    {
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap,
      modules: true,
      getLocalIdent: getCSSModuleLocalIdent,
    },
    'less-loader'
  ),
},
```

### 3 嵌套式写法

`user`  文件夹下新建  `index.less`  文件

```less
.user_container {
  background-color: green;
  padding-top: 50px;
  .user_btn {
    display: block;
    margin: 0 auto;
    width: 200px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: yellow;
    border: 1px solid #000;
  }
}
```

- `user`  文件夹下  `index.js`  中引入  `index.less`  文件

  ```javascript
  import React from "react"
  import './index.less'  // 引入样式文件
  
  class User extends React.Component {
    componentDidMount(){
      console.log('this.props.location',this.props.location);
    }
    userClick(){
      console.log('点击了');
      this.props.history.push({ pathname: '/login', state: { name: 'user页面传递过去的' } })
    }
    render() {
      return (
        <div className='user_container'>
          <h2>这是home页面的子页面 user 页面</h2>
          <button className='user_btn' onClick={this.userClick.bind(this)}>login页面的按钮</button>
        </div>
      )
    }
  }
  
  export default User
  ```

### 4 模块化

`less` 的模块化和 `sass` 的模块化相同，安装 `less-loader` ，仿照 `sass` 对项目进行配置

```javascript
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$

{
	loader: require.resolve('less-loader'),
	options: lessOptions
},
    


{
	test: lessRegex,
	exclude: lessModuleRegex,
	use: getStyleLoaders(
	{
		importLoaders: 3,
		sourceMap: isEnvProduction && shouldUseSourceMap
	},
	'less-loader'
	),
	sideEffects: true
},
{
	test: lessModuleRegex,
	use: getStyleLoaders(
	{
		importLoaders: 3,
		sourceMap: isEnvProduction && shouldUseSourceMap,
		modules: {
			getLocalIdent: getCSSModuleLocalIdent
		}
	},
	'less-loader'
	)
},
```

至此，`react` 项目中使用 `less` 进行编译，及对样式进行模块化开发，完成

## 6 使用 `redux`

### 1 说明

- **action**：简单的说就是一种描述行为的数据结构

- **reducer**：是一个函数，用于通过 `action` 对 `state` 进行更新

  `reducer` 有俩个参数，第一个是 `state(有一个默认值）`，第二个是一个 `action`,

  `reducer` 通过对 `action.type` 进行判断，来决定通过哪种方法更新 `state`.

  注意 `reducer` 必须返回一个新的 `state`，修改原来的 `state` 没有用。

- **store**：我们可以看到由 `dispatcher`  `reducer`  `state` 构成，不难发现 `store` 其实是一个虚拟概念。

  `dispatcher` 是一个函数，用于广播 `action`，将 `action` 传给所有的 `reducer`，`reducer` 然后处理它，对 `state` 进行更新

  `reducer` 是一个函数，用于通过 `action` 对 `state` 进行更新

  `state` 是一个对象，对数据进行储存

  通常我们通过  `const store = createStore(reducer)`  来创建一个 `store`

### 2 以实现一个累加计数器为例 (模块化)

`src`  文件夹下新建  `actions/user.js`

```javascript
export const NUM = 'NUM'

/**
 * 累加数据
 * @param {*} obj 
 */
export const addNum = obj => {
	return {
		type: NUM,
		payload: obj
	};
};

```

`src`  文件夹下新建  `reducers/index.js`  及  `reducers/modules/user.js`

```javascript
// reducers/index.js 文件总入口，模块化管理

import { combineReducers } from 'redux'

// 用户页面的相关数据
import user from './modules/user'

export default combineReducers({
	user
})

```

```javascript
// reducers/modules/user.js user模块相关的数据


import { NUM } from "../../actions/user";

// 初始化数据
const INITIAL_STATE = {
  NUM:0
};

// 数据处理函数
export default function userDataHandler(state = INITIAL_STATE, action) {
	const payload = action.payload;

	switch (action.type) {
		case NUM:
			return {
				...state,
				NUM: state.NUM + payload
			};

		default:
			return state;
	}
}
```

`src`  文件夹下新建  `store/index.js`

```javascript
import { createStore} from "redux";
import reducers from "../reudcers";

const store = createStore(reducers);
export default store;
```

页面中的使用，`pages/user/index.js` 

```javascript
import React from "react"
import './index.less'

import { connect } from 'react-redux'
import { addNum } from '../../actions/user'

class User extends React.Component {
  componentDidMount(){
    console.log('this.props.location',this.props.location);
    console.log('this.propsthis.propsthis.props',this.props);
  }
  userClick(){
    this.props.history.push({ pathname: '/login', state: { name: 'user页面传递过去的' } })
  }
  reduxClick(num){
    this.props.dispatch(addNum(num))
  }
  render() {
    return (
      <div className='user_container'>
        <h2>这是home页面的子页面 user 页面</h2>
        <button className='user_btn' onClick={this.userClick.bind(this)}>login页面的按钮</button>
        <button className='redux_btn' onClick={this.reduxClick.bind(this,2)}>计数器：{this.props.activeHandler.NUM}</button>
      </div>
    )
  }
}

// export default User
export default connect(
  state => ({
      activeHandler: state.user
  })
)(User);
```

**至此，我们就可以点击按钮计数器实现累加效果**

## 7 `axios` 封装

`react`  中封装  `axios`  和  `vue`  中相似

### 1 安装依赖

```javascript
yarn add axios
```

### 2 `axios` 二次封装

`src`  目录下新建  `utils/request.js`  文件

```javascript
import axios from 'axios'

// react初始化项目的时候配置了两个环境 development 和 production
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = '/api'  // 后续添加反向代理
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'http://t.yushu.im_pro'
}

// axios 实例
const request = axios.create({
  baseURL: baseURL,  // 开发环境、生产环境基准地址切换
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
```

`src`  下新建  `utils/service.js`  

```javascript
const Service = {
  login_get:'/mock',
  login_post:'/upload',
  login_uu:'/book/store'
}

export default Service
```

### 3 模块化开发 

 `login`  模块，`src`  下新建  `api/login.js`  

```javascript
import Service from '../utils/service'
import request from '../utils/request'

/**
 * 获取登陆页面的数据
 */
export function getLoginData(params) {
  return request.get(Service.login_get,params)
}

/**
 * 传递登录页面的数据
 */
export function postLoginData(params) {
  return request.post(Service.login_post,{params})
}

/**
 * 传递登录页面的数据（后续测试反向代理用）
 */
export function postUuLoginData(params) {
  return request.post(Service.login_uu,params)
}
```

**至此，我们就将请求模块封装完毕**，`login`  页面中使用：

```javascript
import React from "react"
import './index.less'

import { getLoginData,postLoginData,postUuLoginData } from '../../api/login'

class Login extends React.Component {
  componentDidMount(){
    console.log('this.props.location',this.props.location);
    console.log('processprocessprocessprocess',process.env.NODE_ENV);
      
    // get、post方法测试
    getLoginData({name:'zs'})
    postLoginData({name:'ww'})
      
    // 反向代理测试
    const payLoad = {
      appId: "",
      channel_id: 4,
      marketChannel: "",
      osType: "1",
      packageName: "",
      phoneModel: "",
      product: "2",
      sign: "fd5ee6e8fdf61a8d258a2f6185070c47",
      sysVer: "",
      time: "1604309105",
      token: "5783a6ead5c99b2907bf8b84a1c5a166",
      udid: "",
      ver: "3.1.0"
    }
    postUuLoginData(payLoad)
  }

  render () {
    return (
      <div className='login_container'>
        <h2>这是login页面</h2>
        <button className='login_btn' onClick={this.loginClick.bind(this)}>login页面的按钮</button>
      </div>
    )
  }
}

export default Login
```

**控制台里面可以看到，请求已经发送成功**

## 8 配置反向代理

`vue` 中项目配置可以在根目录下新建 `vue.config.js` 文件然后进行配置，`react` 中我们需要先将配置文件进行抽离，然后对对应的配置进行修改

```javascript
yarn eject
```

可能会报错，因为要在一开始的时候运行，当代码有改动的时候你要`git`上传你的代码，才能 `yarn eject`，可以在操作前把代码提交到代码仓

然后找到 `config` 文件夹下 `webpackDevServer.config.js` 文件进行修改

```javascript
module.exports = function (proxy, allowedHost) {
  return {
      ...,
      public: allowedHost,
	  // `proxy` is run between `before` and `after` `webpack-dev-server` hooks
      // proxy,     // 修改前
      proxy:{     // 修改后
      "/api":{
          target:"https://api.uuseesee.com",
          changeOrigin:true,
          pathRewrite:{
          "^/api":""
          }
      }
    },
  }
```

**注：配置完成后我们需要将项目重新启动**

然后，我们把封装的 `axios` 文件进行修改，把 `baseURL` 设置为 `/api` ，至此，配置完成，使用上面 `postUuLoginData` 方法进行测试。

## 9 配置移动端 `rem` 布局

### 1 安装依赖

`react` 项目中配置 `rem` 布局

```javascript
yarn add  lib-flexible postcss-px2rem
```

### 2 项目配置

在 `index.js` 中引入 `lib-flexible`

```javascript

import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
// import App from './App';
import MyRouter from './router/index'
import reportWebVitals from './reportWebVitals';

// 引入状态管理
import { Provider } from "react-redux";
import store from './store'

import 'lib-flexible'  // ------引入rem相关布局依赖

ReactDOM.render(

  // 去除严格模式,处理控制台报错

  // 使用 Provider 包裹组件
  <Provider store={store}>
    <MyRouter />
  </Provider>
  
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

对配置文件 `webpack.config.js` 进行修改，添加 **两处配置**

```javascript
// 添加rem布局设置
const px2rem = require('postcss-px2rem')

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function (webpackEnv) {
		...,
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            postcssNormalize(),
            px2rem({remUnit:37.5}),  // 添加rem布局设置
          ],
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
}
```

测试使用 `src/pages/news/index.js` 页面，添加一个 `box` ，样式文件直接写375页面中的宽高即可

```less
.container_news {
  background-color: pink;
  .boxx {
    width: 150px;
    height: 150px;
    text-align: center;
    line-height: 150px;
    background-color: greenyellow;
    margin: 0 auto;
  }
}
```

**至此，`react` 移动端 `rem` 布局配置完成**