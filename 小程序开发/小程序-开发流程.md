# 小程序开发

## 准备

### 1 注册 登录

在 [微信小程序官网](https://mp.weixin.qq.com/cgi-bin/wx) 注册账号，注册完成后进行登录

### 2 获取 AppID

AppID 作为一个唯一标识，在后面小程序开发里面起到贯穿始终的作用，注册登录进去之后，左侧 - 开发 模块，“开发设置” 里面可以获取到你的 AppID

### 3 项目开发

可以使用市场上已经存在的框架或者原生的小程序代码进行开发，下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) ，在微信开发者工具里面设置好 AppID ，项目编译之后运行在开发工具里面，没有问题的话点击 上传 即可把编译之后的代码上传到个人账号里面

### 4 项目上线

在 微信开发者工具 中上传的代码，首先进行基础的设置：应用名称 icon 等，然后点击提交审核，等待一段时间（半天左右），若审核通过，则可以把你审核通过的代码上传到线上版本

## 使用taro进行小程序开发

### 1 项目搭建

安装完 `taro`  脚手架之后，使用命令初始化 `taro` 项目  ：  `taro init`，输入命令后根据提示进行选择

项目结构：

```markdown
├── babel.config.js             # Babel 配置
├── .eslintrc.js                # ESLint 配置
├── config                      # 编译配置目录
│   ├── dev.js                  # 开发模式配置
│   ├── index.js                # 默认配置
│   └── prod.js                 # 生产模式配置
├── package.json                # Node.js manifest
├── dist                        # 打包目录
├── project.config.json         # 小程序项目配置
├── src # 源码目录
│   ├── app.config.js           # 全局配置
│   ├── app.css                 # 全局 CSS
│   ├── app.js                  # 入口组件
│   ├── index.html              # H5 入口 HTML
│   └── pages                   # 页面组件
│       └── index
│           ├── index.config.js # 页面配置
│           ├── index.css       # 页面 CSS
│           └── index.jsx       # 页面组件，如果是 Vue 项目，此文件为 index.vue
```

### 2 项目运行

打开 `package.json` 运行里面的命令

```javascript
  "scripts": {
    "weapp":"npm run build:weapp -- --watch",		// 自定义命令
    ...,
    "dev:weapp": "npm run build:weapp -- --watch",	// 生成小程序文件并添加监听实现热更新
    ...
  },
```

运行自定义的命令 `npm run weapp`  或  `dev:weapp` 即可在项目根目录下生成 `dist` 文件夹

使用微信开发工具打开 `dist` 文件，就可以运行小程序

### 3 项目配置

#### 1 编译配置

编译配置存放于项目根目录下 `config` 目录中，包含三个文件

- `index.js` 是通用配置
- `dev.js` 是项目预览时的配置
- `prod.js` 是项目打包时的配置

[配置详情]: https://taro-docs.jd.com/taro/docs/config

#### 2 尺寸适应

在 Taro 中尺寸单位建议使用 `px`、 `百分比 %`，Taro 默认会对所有单位进行转换。在 Taro 中书写尺寸按照 1:1 的关系来进行书写，即从设计稿上量的长度 `100px`，那么尺寸书写就是 `100px`，当转成微信小程序的时候，尺寸将默认转换为 `100rpx`，当转成 `H5` 时将默认转换为以 `rem` 为单位的值。

如果你希望部分 `px` 单位不被转换成 `rpx` 或者 `rem` ，最简单的做法就是在 `px` 单位中增加一个大写字母，例如 `Px` 或者 `PX` 这样，则会被转换插件忽略。

结合过往的开发经验，Taro 默认以 `750px` 作为换算尺寸标准，如果设计稿不是以 `750px` 为标准，则需要在项目配置 `config/index.js` 中进行设置，例如设计稿尺寸是 `640px`，则需要修改项目配置 `config/index.js` 中的 `designWidth` 配置为 `640`：

**目前 Taro 支持 `750`、 `640` 、 `828` 三种尺寸设计稿**

```javascript
const config = {
  projectName: 'myProject',
  date: '2018-4-18',
  designWidth: 375,
  ....
}
```

#### 3 路径配置

为了避免书写多级相对路径，我们可以如下配置 `alias`：

```javascript
module.exports = {
  // ...
  alias: {
    '@/actions': path.resolve(__dirname, '..', 'src/actions'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/package': path.resolve(__dirname, '..', 'package.json'),
    '@/project': path.resolve(__dirname, '..', 'project.config.json'),
  }
}
```

### 4 使用 `redux` 进行状态管理

小程序中 `redux` 的使用和 `react` 项目中相似，以模块化开发累加器为例，`src` 文件夹下：

- `constants/home.js` 中

  ```javascript
  export const ADD = 'ADD'  // 累加
  ```

- `actions/home.js` 中

  ```javascript
  import { ADD, } from '../constants/home'
  
  export const add = (num=3) => {
    return {
      type: ADD,num
    }
  }
  
  // 异步的action
  export function asyncAdd () {
    return dispatch => {
      setTimeout(() => {
        dispatch(add())
      }, 2000)
    }
  }
  ```

- `reducers/modules/home.js` 中

  ```javascript
  import { ADD } from '../../constants/home'
  
  const INITIAL_STATE = {
    num: 0
  }
  
  export default function counter (state = INITIAL_STATE, action) {
    switch (action.type) {
      case ADD:
        return {
          ...state,
          num: state.num + action.num
        }
       default:
         return state
    }
  }
  ```

- `reducers/index.js` 中

  ```javascript
  import { combineReducers } from 'redux'
  import home from './modules/home'
  
  export default combineReducers({
    home
  })
  ```

- `pages/home/index.js` 中

  ```javascript
  import React, { Component } from 'react'
  import { connect } from 'react-redux'
  
  import { View, Button } from '@tarojs/components'
  import { add } from '@/actions/home'
  
  import './index.less'
  
  @connect(state => ({
  	home: state.home,
  }), { add })
  
  class Home extends Component {
  
    addClick(){
      console.log('点击了添加');
      this.props.add()
    }
  
    goLogin(){
      console.log('点击了跳转按钮');
    }
  
    render () {
      return (
        <View className='index'>
          <View>这是index页面</View>
          <View>{this.props.home.num}</View>
          <Button className='btn' onClick={this.addClick.bind(this)}>累加</Button>
          <Button className='btn' onClick={this.goLogin.bind(this)}>跳转login</Button>
        </View>
      )
    }
  }
  
  export default Home
  ```

**至此，使用 `redux` 对小程序进行状态管理，完成**

**注：**若不想在使用时，控制台出现 `redux-logger` 提供的中间日志，可以全局搜索然后禁用

### 5 路由管理

`taro` 框架定义好了路由跳转及参数接收的方法

```javascript
import Taro,{ getCurrentInstance } from '@tarojs/taro'

// 路由跳转
Taro.navigateTo({
	url: '/pages/login/index?id=2&type=test'
})

// 参数接受
getCurrentInstance().router.params
```

- `home/index.js` 页面中：

  ```javascript
  import React, { Component } from 'react'
  import Taro from '@tarojs/taro'
  
  class Home extends Component {
      
    goLogin(){
      console.log('点击了跳转按钮');
      Taro.navigateTo({
        url: '/pages/login/index?id=2&type=test'
      })
    }
  
    render () {
      return (
        <View className='index'>
          <View>这是index页面</View>
          <View>{this.props.home.num}</View>
          <Button className='btn' onClick={this.addClick.bind(this)}>累加</Button>
          <Button className='btn' onClick={this.goLogin.bind(this)}>跳转login</Button>
        </View>
      )
    }
  }
  
  export default Home
  ```

- 跳转到的 `login` 页面中

  ```javascript
  import { View,Button } from "@tarojs/components"
  import React,{ Component } from "react"
  
  import Taro,{ getCurrentInstance } from '@tarojs/taro'
  import './index.less'
  
  class Login extends Component{
  
    componentDidMount(){
      // console.log('this',this);
      console.log('getCurrentInstance',getCurrentInstance().router.params);
    }
  
    loginClick(){
      console.log('点击了login页面的按钮');
      Taro.navigateTo({
        url: '/pages/home/index'
      })
    }
      
    render(){
      return(
        <View className='login_container'>
          <View>login页面</View>
          <Button className='btn' onClick={this.loginClick.bind(this)}>跳转home</Button>
        </View>
      )
    }
  }
  
  export default Login
  
  ```

**至此，在 `taro` 中进行路由跳转及参数接收，完成**

### 6 封装请求

新建 `utils/request.js`

```javascript
import Taro from '@tarojs/taro'

let base = 'http://restapi.amap.com'
let token = 'token'

function request(params, method = 'GET') {
  return new Promise((resolve, reject) => {
    let { url, data } = params
    let contentType = 'application/x-www-form-urlencoded'
    contentType = params.contentType || contentType
    return Taro.request({
      isShowLoading: false,
      url: base + url,
      data: data,
      method: method,
      header: { 'content-type': contentType, 'token': token }, // 默认contentType ,预留token
      success(res) {
        resolve(res.data)
      },
      error(e) {
        reject(logError('api', '请求接口出现问题', e))
      }
    })
  })
}


export function get(url, data = '') {
  let option = { url, data }
  return request(option)
}

export const post = (url, data, contentType) => {
  let params = { url, data, contentType }
  return request(params, 'POST')
}
```

新建 `src/utils/http.js`

```javascript
import Taro from "@tarojs/taro";

import { base } from "@/utils/index";

const HOSTNAME = 'http://restapi.amap.com';

const request = async obj => {
  const { method, url } = obj;
  let { data } = obj;
  const token = '123456789'

  const header = {
    Authorization: `Bearer ${token}`,
  };


  const option = {
    url: HOSTNAME + url,
    data: data,
    method: method,
    header: header,
    success(res) {
      // 对不同状态的数据进行处理，执行不同的操作
      // 当 token 过期时，删除本地 token 重新执行
      if (res.statusCode === 401 && res.data.error.code === 30) {
        // Taro.removeStorageSync(STORAGE_TOKEN);
        console.log('删除本地，重新执行');
        request(obj);
      } else {
        obj.success && obj.success(res);
      }
    },
    fail(e) {
      new Error("网络请求出错");
    },
  };
  Taro.request(option);
};

export default class Http {
  async commonHttp(method, url, data) {
    return new Promise(async (resolve, reject) => {
      Taro.showNavigationBarLoading();
      try {
        const res = await base(request)({
          method,
          url,
          data,
        });
        Taro.hideNavigationBarLoading();
        switch (res.statusCode) {
          case 200:
          case 201:
            return resolve(res.data);
          case 500:
            Taro.showToast({
              title: "服务器发生错误，请检查服务器。",
              icon: "none",
            });
            reject(new Error(res.data.error.message));
            break;
          case 503:
            Taro.showToast({
              title: "服务不可用，服务器暂时过载或维护。",
              icon: "none",
            });
            reject(new Error(res.data));
            break;
          default:
            reject(error);
        }
      } catch (error) {
        Taro.hideNavigationBarLoading();
        reject(new Error("网络请求出错"));
      }
    });
  }

  get(url, data) {
    return this.commonHttp("GET", url, data);
  }

  post(url, data) {
    return this.commonHttp("POST", url, data);
  }

  delete(url, data) {
    return this.commonHttp("DELETE", url, data);
  }

  put(url, data) {
    return this.commonHttp("PUT", url, data);
  }
}
```

自定义的两个函数 `base` 和 `formatRequestError`

```javascript
/**
 * 封装 Promise
 */
export const base = (request) => (obj) => new Promise((resolve, reject) => {
  const _object = Object.assign(obj, {
    success: (res) => resolve(res),
    fail: (err) => reject(err)
  });
  request(_object);
});
```

**至此，一个请求方法封装，完成**

**注：**关于开发环境和生产环境切换，以及跨域的问题，微信在发送请求的时候已经在通过腾讯这个中间服务器进行数据请求，所以我们 `不必要去配置反向代理解决跨域问题`

### 7 自定义导航栏

我们可以使用框架提供的默认的导航栏，也可以根据自己的需要开发导航栏组件，步骤如下：

1. 开启自定义导航栏，根目录下 `app.config.js`

   ```javascript
   export default {
     pages: [
       'pages/home/index',
       'pages/login/index'
     ],
     window: {
       backgroundTextStyle: 'dark',			// 下拉背景字体、loading 图的样式
       navigationBarBackgroundColor: '#ffffff',// 设置导航栏背景色
       navigationBarTitleText: 'taro-demo',	// 设置导航栏默认标题
       navigationBarTextStyle: 'black',		// 设置状态栏字体颜色（信号、电量那些）
       navigationStyle: "custom",				// 这行代码代表开启自定义导航栏
     }
   }
   
   // 开启自定义导航栏之后，上面的设置不生效，只有状态栏的字体颜色可以配置，通常设置为 black 
   ```

2. 新建 `components/nav-bar/index.jsx`

   ```jsx
   /* eslint-disable react/react-in-jsx-scope */
   import Taro from "@tarojs/taro";
   import React, { Component } from 'react'
   import { View, Image, Text, Block } from "@tarojs/components";
   import classNames from "classnames";
   import { getStatusBarHeight, getTitleBarHeight, objectToString } from "../../utils/style";
   
   // 图片资源
   import backBlackIcon from "./assets/ic-back-black.svg";
   import backWhiteIcon from "./assets/ic-back-white.svg";
   import backHomeIcon from "./assets/ic-back-home.svg";
   import backHomeWhiteIcon from "./assets/ic-back-home-white.svg";
   
   import "./index.less";
   
   const HomePage = '/pages/home/index';
   
   export default class NavBar extends Component {
   
     componentDidMount() {
       console.log('getTitleBarHeight()', getTitleBarHeight());
       console.log('getStatusBarHeight()', getStatusBarHeight());
     }
   
     onClickBackIcon() {
       const { beforeBackCheck } = this.props;
       if (beforeBackCheck) {
         this.props.onBack();
         return;
       }
       if (Taro.getCurrentPages().length > 1) {
         Taro.navigateBack();
       } else {
         Taro.redirectTo({
           url: HomePage,
         });
       }
     }
   
     onClickBackHome() {
       const pages = Taro.getCurrentPages();
       if (HomePage.indexOf(pages[0].route) > -1) {
         Taro.navigateBack({
           delta: pages.length - 1,
         });
       } else {
         Taro.redirectTo({
           url: HomePage,
         });
       }
     }
   
     getNavBarStyle() {
       const { backgroundColor, backgroundImage, background } = this.props;
       return objectToString({
         "height": getTitleBarHeight(),
         "padding-top": getStatusBarHeight(),
         "background-color": backgroundColor,
         "background-image": "url(" + backgroundImage + ")",
         "background": background,
       })
     }
     getNavBarHeight() {
       return objectToString({
         "height": getTitleBarHeight(),
         "padding-top": getStatusBarHeight(),
       })
     }
   
   
     render() {
       const { title, titleStyle, showHome, } = this.props;
   
       let backIcon = backBlackIcon;
       if (titleStyle === "white") {
         backIcon = backWhiteIcon;
       }
       if (Taro.getCurrentPages().length === 1) {
         backIcon = ''
         if (showHome) {
           backIcon = backHomeIcon;
           if (titleStyle === "white") {
             backIcon = backHomeWhiteIcon
           }
         }
       }
   
       return (
         <View style={this.getNavBarHeight()}>
           <View className='nav_bar_content' style={this.getNavBarStyle()}>
   
             <View className="nav_bar_content_container">
               <Image className='icon_left'
                 src={backIcon} onClick={this.onClickBackIcon}
               ></Image>
               <View className='nav_bar_title ellipsis line1'>
                 {title}
               </View>
   
             </View>
           </View>
         </View >
       );
     }
   }
   
   NavBar.defaultProps = {
     title: "",
     backgroundColor: "#fff",
     titleStyle: "black",
     hasBack: true,
     showHome: false,
     backgroundImage: '',
     beforeBackCheck: false,
     onBack: () => {
     },
   };
   
   ```

3. 新建 `components/nav-bar/index.less`

   ```less
   .nav_bar_content{
     width: 100%;
     display: flex;
     align-items: center;
     flex-direction: row;
     justify-content: center;
     position: fixed;
     left: 0;
     top: 0;
     z-index: 999;
   }
   
   .nav_bar_content_container{
     width: 100%;
     height: 100%;
     flex: 1;
     position: relative;
     .icon_left{
       width: 44px;
       height: 44px;
       position: absolute;
       left: 20px;
       top: 0;
       bottom: 0;
       margin: auto;
     }
     .nav_bar_title{
       width: 300px;
       height: 36px;
       line-height: 36px;
       font-size: 36px;
       text-align: center;
       height: 36px;
       line-height: 36px;
       position: absolute;
       left: 50%;
       top: 0;
       bottom: 0;
       margin: auto;
       transform: translateX(-50%);
     }
   }
   ```

4. 页面使用

   ```jsx
   import React, { Component } from 'react'
   import Taro from '@tarojs/taro'
   import { connect } from 'react-redux'
   
   import { View, Button } from '@tarojs/components'
   import { add } from '@/actions/home'
   
   import NavBar from '../../components/nav-bar/index'
   
   import './index.less'
   
   @connect(state => ({
     home: state.home,
   }), { add })
   
   class Home extends Component {
   
     state = {
       data1: 'home数据1',
       data2: 'home数据2'
     }
   
     addClick() {
       this.props.add()
     }
   
     goLogin() {
       Taro.navigateTo({
         url: '/pages/login/index?id=2&type=test'
       })
     }
   
     stateClick() {
       this.setState({
         data1: '改变后的数据'
       })
     }
   
     render() {
       const { data1, data2 } = this.state
       return (
         <View className='home'>
           <NavBar title='首页1234567898765432'></NavBar>
           <View>这是index页面：{data1}--{data2}</View>
           <View>{this.props.home.num}</View>
           <View className='btn' onClick={this.addClick.bind(this)}>累加</View>
           <View className='btn' onClick={this.goLogin.bind(this)}>跳转login</View>
           <View className='btn' onClick={this.stateClick.bind(this)}>改变数据</View>
         </View>
       )
     }
   }
   
   export default Home
   ```

**至此，自定义导航栏开发，完成**

## 项目上传

使用 `微信开发工具` ，右上角 `详情` 里面配置好 `APPID` ，之后就可以点击 右上角 `上传` ，即可把项目文件上传到 `小程序开发平台` 

打开  [小程序管理平台](https://mp.weixin.qq.com/wxamp/wacodepage/getcodepage?token=1805773240&lang=zh_CN) ，左侧  `管理` ，在  `版本管理` 里面就可以把测试版提交审核

