# webpack4 多页面 多环境配置

使用 **webpack4 + 原生html** ，搭建多页面应用（例如：app配套的活动项目）

**项目目录：**

```
build
  |-envs.js
  |-rules.js
  |-webpack.base.conf.js
  |-webpack.dev.conf.js
  |-webpack.prod.conf.js
  |-webpack.test.conf.js
src
  |-commom
    |-css
    |-js
  |-pages
    |-home
      |-home.js
      |-index.html
      |-index.js
      |-index.scss
  |-static
    |-images
      |-home
        |-1.png
oss.js
postcss.config.js
package.json
```

**主要配置 `build` 中的文件**

## 一、envs.js

**多环境**

```javascript
'use strict'

const path = require('path')
/*
 * 环境列表，第一个环境为默认环境
 * envName: 指明现在使用的环境
 * dirName: 打包的路径，只在build的时候有用
 * baseUrl: 这个环境下面的api 请求的域名
 * assetsPublicPath: 静态资源存放的域名，未指定则使用相对路径
 * */
const ENV_LIST = [
    {
        // 本地开发环境
        envName: 'dev',
        dirName: 'dev',
        baseUrl: '',
        assetsPublicPath: '/'
    },
    {
        // 测试环境
        envName: 'test',
        dirName: path.resolve(__dirname, '../dist_h5'),
        baseUrl: '',
        assetsPublicPath: '/'
    },
    {
        // 生产环境（命令行参数（process.arg）中prod是保留字，所以使用pro）
        envName: 'pro',
        dirName: path.resolve(__dirname, '../dist_h5'),
        baseUrl: '',
        assetsPublicPath: './'
    },

]

//获取环境，即--mode后的环境
const HOST_ENV = JSON.parse(process.env.npm_config_argv).original[3] || ""
//没有设置环境，则默认为第一个
const HOST_CONF = HOST_ENV ? ENV_LIST.find(item => item.envName === HOST_ENV) : ENV_LIST[0]
// 把环境常量挂载到process.env方便客户端使用
process.env.BASE_URL = HOST_CONF.baseUrl

module.exports.HOST_CONF = HOST_CONF
module.exports.ENV_LIST = ENV_LIST

```

## 二、rules.js

**公共工具**

```javascript
const extractTextPlugin = require("extract-text-webpack-plugin");
const rules = [{
	test: /\.(css|scss|sass)$/,
	// 区别开发环境和生成环境
	use: process.env.NODE_ENV === "development" ? ["style-loader", "css-loader", "sass-loader", "postcss-loader"] : extractTextPlugin
		.extract({
			fallback: "style-loader",
			use: ["css-loader", "sass-loader", "postcss-loader"],
			// css中的基础路径
			publicPath: "../"
		})
},
{
	test: /\.js$/,
	use: [{
		loader: "babel-loader"
	}],
	// 不检查node_modules下的js文件
	// exclude: "/node_modules/"
}, {
	test: /\.(png|jpg|gif)$/,
	use: [{
		// 需要下载url-loader
		loader: "url-loader?limit=100&outputPath=./static/images&name=[name].[ext]",
		//新版本的url-loader的limit属性有时无效,故隐藏下方属性
		// options: {
		//   limit: 5000 , //小于这个时将会已base64位图片打包处理
		//   // 图片文件输出的文件夹
		//   publicPath: "./",
		//   outputPath: "./static/images"
		// }
	}]
},
{
	test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
	use: [{
		// 需要下载url-loader
		loader: 'file-loader?limit=100&outputPath=./static/audio&name=[name].[ext]&publicPath=./static/audio',
	}]

},
{
	test: /\.html$/,
	// html中的img标签
	use: {
		loader: 'html-loader',
		options: {
			attrs: ['img:src', 'img:data-src', 'audio:src'],
			minimize: true
		}
	}
},
	// {
	//         test: /\.mp3$/i,
	// 		use: 'file-loader'
	//       },
];
module.exports = rules;

```

## 三、webpack.base.conf.js

```javascript
const path = require('path');
const webpack = require("webpack");
const glob = require("glob");

require("./envs");
//消除冗余的css
const purifyCssWebpack = require("purifycss-webpack");
// html模板
const htmlWebpackPlugin = require("html-webpack-plugin");
//静态资源输出
const copyWebpackPlugin = require("copy-webpack-plugin");
const rules = require("./rules");

// 获取html-webpack-plugin参数的方法
// 配合htmlwebpackplugin,htmlwebpackplugin需要一些配置，而多页面应用就需要产出多个同配置但是不同名的html文件，这个方法就是用传入的参数而产生不同的页面名配置。
function getHtmlConfig(name, chunks) {
    return {
        template: `./src/pages/${name}/index.html`,
        filename: process.env.NODE_ENV === "development" ? `${name.slice(name.lastIndexOf('/') + 1)}.html` : `${name.slice(name.lastIndexOf('/') + 1)}.html`,
        inject: true,
        hash: false, //开启hash  ?[hash]
        chunks: chunks,
        minify: process.env.NODE_ENV === "development" ? false : {
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: true, //折叠空白区域 也就是压缩代码
            removeAttributeQuotes: true, //去除属性引用
        },
    };
};

// 获取到我们pages下各个页面的index.js,然后返回一个对象,不用手动添加
function getEntry() {
    var entry = {};
    //读取src目录所有page入口
    glob.sync('./src/pages/**/index.js')
        .forEach(function (name) {
            var start = name.indexOf('src/') + 4,
                end = name.length - 3;
            var eArr = [];
            var n = name.slice(start, end);
            n = n.slice(0, n.lastIndexOf('/')); //保存各个组件的入口
            n = n.split('pages/')[1];
            eArr.push(name);
            entry[n] = eArr;
        });
    return entry;
};

module.exports = {
    entry: getEntry(),
    module: {
        rules: [...rules]
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    //将外部变量或者模块加载进来
    externals: {
        // 'jquery': 'window.jQuery'
    },
    // 提取公共代码
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: { // 抽离第三方插件
                    test: /node_modules/, // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor', // 打包后的文件名，任意命名
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
                utils: { // 抽离自己写的公共代码
                    chunks: 'initial',
                    name: 'common', // 任意命名
                    minSize: 0, // 只要超出0字节就生成一个新包
                    minChunks: 2
                }
            }
        }
    },
    plugins: [
        //静态资源输出
        new copyWebpackPlugin([{
            from: path.resolve(__dirname, "../src/static"),
            to: './static',
            ignore: ['.*']
        }]),
        // 消除冗余的css代码
        new purifyCssWebpack({
            paths: glob.sync(path.join(__dirname, "../src/pages/*/*.html"))
        })
    ]
}

//配置页面
const entryObj = getEntry();
const htmlArray = [];
Object.keys(entryObj).forEach(element => {
    htmlArray.push({
        _html: element,
        title: '',
        chunks: ['vendor', 'common', element]
    })
})

//自动生成html模板
htmlArray.forEach((element) => {
    module.exports.plugins.push(new htmlWebpackPlugin(getHtmlConfig(element._html, element.chunks)));
})

```

## 四、webpack.dev.conf.js

**本地开发环境**

```javascript
const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackConfigBase = require('./webpack.base.conf');

const webpackConfigDev = {
    mode: 'development', // 通过 mode 声明开发环境
    output: {
        path: path.resolve(__dirname, '../dist_h5'),
        // 打包多出口文件
        filename: 'js/[name].[hash:5].js'
    },
    devServer: {
        contentBase: path.join(__dirname, "../src/pages/index"),
        publicPath: '/',
        host: "0.0.0.0", //这里修改自己电脑ip
        port: "9088",
        overlay: true, // 浏览器页面上显示错误
        // open: true, // 开启浏览器
        // stats: "errors-only", //stats: "errors-only"表示只打印错误：
        //服务器代理配置项
        proxy: {
            '/testing/*': {
                target: '',
                secure: true,
                changeOrigin: true
            }
        }
    }
}
module.exports = merge(webpackConfigBase, webpackConfigDev);
```

## 五、webpack.test.conf.js

**线上测试环境**

```javascript
const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
// 清除目录等
const cleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const extractTextPlugin = require("extract-text-webpack-plugin");
const webpackConfigBase = require('./webpack.base.conf');
const WebpackAliyunOss = require('webpack-aliyun-oss')
const Oss = require('../oss')

const webpackConfigProd = {
	mode: 'development', // 通过 mode 声明生产环境

	output: {
		path: path.resolve(__dirname, '../dist_h5'),
		// 打包多出口文件
		filename: 'js/[name].[hash].js',
		publicPath: './'
	},

	// 将js代码转化为字符串，此操作会影响后续js代码删除console
	// devtool: 'cheap-module-eval-source-map',

	plugins: [
		//删除dist_h5目录
		new cleanWebpackPlugin(['dist_h5'], {
			root: path.resolve(__dirname, '../'), //根目录
			verbose: true, //开启在控制台输出信息
			dry: false,
		}),
		new webpack.DefinePlugin({
			'process.env.BASE_URL': '\"' + process.env.BASE_URL + '\"'
		}),
		// 分离css插件参数为提取出去的路径
		new extractTextPlugin({
			filename: 'css/[name].[hash:8].min.css',
		}),
		//压缩css
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true
			}
		}),

        // 自动上传至阿里云服务器
		new WebpackAliyunOss({
			from: './dist_h5/**',
			dist: '/ost/test/',
			region: Oss.region,
			accessKeyId: Oss.accessKeyId,
			accessKeySecret: Oss.accessKeySecret,
			bucket: Oss.bucket,
			// test: true,
			setOssPath: filePath => {
				// some operations to filePath
				const index = filePath.lastIndexOf('dist_h5')
                // 7为 dist_h5 字符串的长度
				const Path = filePath.substring(index + 7, filePath.length)
				return Path.replace(/\\/g, '/')
			},
			setHeaders: filePath => {
				// some operations to filePath
				// return false to use default header
				return {
					'Cache-Control': 'max-age=31536000'
				}
			}
		})
	]

}
module.exports = merge(webpackConfigBase, webpackConfigProd);

```

## 六、webpack.prod.conf.js

**生产环境**

```javascript
const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
// 清除目录等
const cleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const extractTextPlugin = require("extract-text-webpack-plugin");
const webpackConfigBase = require('./webpack.base.conf');

const webpackConfigProd = {
	mode: 'production', // 通过 mode 声明生产环境

	output: {
		path: path.resolve(__dirname, '../dist_h5'),
		// 打包多出口文件
		filename: 'js/[name].[hash].js',
		publicPath: './'
	},

	// 将js代码转化为字符串，此操作会影响后续js代码删除console
	// devtool: 'cheap-module-eval-source-map', 

	plugins: [
		//删除dist_h5目录
		new cleanWebpackPlugin(['dist_h5'], {
			root: path.resolve(__dirname, '../'), //根目录
			verbose: true, //开启在控制台输出信息
			dry: false,
		}),
		new webpack.DefinePlugin({
			'process.env.BASE_URL': '\"' + process.env.BASE_URL + '\"'
		}),
		// 分离css插件参数为提取出去的路径
		new extractTextPlugin({
			filename: 'css/[name].[hash:8].min.css',
		}),
		//压缩css
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true
			}
		}),
		// 上线压缩 去除console等信息webpack4.x之后去除了webpack.optimize.UglifyJsPlugin
		new UglifyJSPlugin({
			uglifyOptions: {
				output: {
					comments: false // 去除注释
				},
				compress: {
					warnings: false,
					drop_debugger: false,
					drop_console: true, // 去除console
				}
			}
		}),
	],

}
module.exports = merge(webpackConfigBase, webpackConfigProd);

```

## 七、package.json

**包管理**

```javascript
{
  "name": "h5",
  "version": "1.0.8",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.dev.conf.js",
    "build:test": "cross-env webpack --config build/webpack.test.conf.js",
    "build:pro": "cross-env webpack --config build/webpack.prod.conf.js"
  },
  "license": "ISC",
  "devDependencies": {
    "autoprefixer": "^8.5.0",
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.4",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-polyfill": "^6.26.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-3": "^6.24.1",
    "clean-webpack-plugin": "^0.1.19",
    "copy-webpack-plugin": "^4.6.0",
    "cross-env": "^5.1.5",
    "css-loader": "^3.2.0",
    "exports-loader": "^0.7.0",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "file-loader": "^1.1.11",
    "glob": "^7.1.3",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "html-withimg-loader": "^0.1.16",
    "live-server": "^1.2.0",
    "mini-css-extract-plugin": "^0.8.0",
    "node-sass": "^4.9.0",
    "optimize-css-assets-webpack-plugin": "^5.0.3",
    "postcss-import": "^11.1.0",
    "postcss-loader": "^2.1.5",
    "postcss-plugin-px2rem": "^0.8.1",
    "postcss-url": "^7.3.2",
    "purify-css": "^1.2.5",
    "purifycss-webpack": "^0.7.0",
    "raw-loader": "^4.0.2",
    "sass-loader": "^7.0.1",
    "script-loader": "^0.7.2",
    "style-loader": "^0.21.0",
    "uglify-js": "^3.12.8",
    "uglifyjs-webpack-plugin": "^1.3.0",
    "url-loader": "^0.5.9",
    "webpack": "^4.29.6",
    "webpack-aliyun-oss": "^0.3.1",
    "webpack-bundle-analyzer": "^3.6.0",
    "webpack-cli": "^3.1.1",
    "webpack-dev-server": "^3.1.4",
    "webpack-merge": "^4.1.2"
  },
  "dependencies": {
    "axios": "^0.19.0",
    "callapp-lib": "^3.1.3",
    "jquery": "^3.5.1",
    "qrcode": "^1.4.4",
    "reset-css": "^5.0.1"
  },
  "browserslist": [
    "defaults",
    "not ie < 11",
    "last 2 versions",
    "> 1%",
    "iOS 7",
    "last 3 iOS versions"
  ]
}
```

## 八、postcss.config.js

**rem布局配置**

```javascript
module.exports = {
    plugins: [
        //自动添加css前缀
        require('autoprefixer'),
        //转换rem  需 install postcss-plugin-px2rem
        require("postcss-plugin-px2rem")({ 'remUnit': 75, 'baseDpr': 2 })
    ]
};
```

## 九、oss.js

```javascript
module.exports = {
  region: 'xxx',
  accessKeyId: 'xxxxxx',
  accessKeySecret: 'xxxxxxx',
  bucket: 'xxx'
}
```

## 十、使用

- `pages/home/index.html`

  ```html
  <!DOCTYPE html>
  <html lang="en" style="font-size: 100px;">
  
  <head>
  	<meta charset="UTF-8">
  	<meta name="viewport"
  		content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no, viewport-fit=cover" />
  	<meta http-equiv="X-UA-Compatible" content="ie=edge">
  	<meta name="apple-mobile-web-app-capable" content="yes">
  	<title>index</title>
  
  </head>
  
  <body>
  	<div class="container">
  		<div class="box">1111</div>
  
  		<div class="box2">33333</div>
  
  		<img src="../../static/images/home/1.png" alt="">
  
  	</div>
  
  </body>
  
  </html>
  ```

- `pages/home/index.scss`

  ```scss
  body {
    margin: 0 auto;
    // max-width: 750px;
  }
  
  .container {
    .box {
      width: 187.5px;
      height: 187.5px;
      background-color: red;
      text-align: center;
      line-height: 187.5px;
      font-size: 30px;
      border: 10px solid #000;
    }
    .box2 {
      margin-top: 20px;
      width: 50%;
      height: 2rem;
      background-color: green;
      text-align: center;
      line-height: 187px;
      font-size: 30px;
    }
  }
  
  ```

- `pages/home/index.js`

  ```javascript
  import 'reset-css'
  import '@/common/js/rem.js'
  import './index.scss'
  import '@/common/css/common.css'
  
  import Home from './home'
  new Home()
  ```

- `pages/home/home.js`

  ```javascript
  import request from '../../common/js/request'
  
  function $$(id) {
    return document.querySelector(id)
  }
  
  const CONFIG = {
    api: '/promote/annual-festival-list',
  }
  
  /**
   * jsbrudge  js与ios交互
   **/
  function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
    } else {
      document.addEventListener(
        'WebViewJavascriptBridgeReady',
        function () {
          callback(WebViewJavascriptBridge)
        },
        false
      )
    }
  
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback)
    }
    window.WVJBCallbacks = [callback]
    var WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }
  
  class Home {
    constructor() {
      this.userInfo = null
      this.isLoading = false
      this.init()
    }
    init() {
      console.log('页面进入');
      console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    }
  
    // 获取数据
    getData() {
      if (this.isLoading) return // 防抖处理
      const payLoad = {
        token: this.userInfo.token,
        type_id: this.tabSel
      }
      try {
        this.isLoading = true
        request.post(CONFIG.api, payLoad).then(res => {
          if (res.code != '0') {
            this.toast(res.msg)
            return
          }
          this.isLoading = false
          this.res = res.data
  
          const top3 = this.res.list.splice(0, 3)
          $$('.top3').innerHTML = this.getTop3(top3)
  
          const tempArr = this.res.list.splice(0, 7)
          this.showingList = tempArr
  
          $$('.list_container').innerHTML = this.getList(this.showingList)
          $$('.fourth_content').innerHTML = this.getSelf(this.res.my_info)
  
  
        }).catch(err => {
          console.log('err----', err);
          this.isLoading = false
        })
      } catch (error) {
  
      }
    }
  
    // 与客户端交互获取用户基本信息(token等)
    getInfo() {
      const that = this
      if (/android/i.test(navigator.userAgent)) {
        try {
          that.userInfo = window.android.getInfo()
          that.userInfo = eval('(' + that.userInfo + ')')
          that.getData()
        } catch (e) {
          console.log(e, 'android报错')
        }
      } else if (/ios|iphone|ipod|pad/i.test(navigator.userAgent)) {
        try {
          setupWebViewJavascriptBridge(function (bridge) {
            var data = 'hello'
            bridge.callHandler('getInfo', data, function (resp) {
              that.userInfo = resp
              that.getData()
              console.log(resp, '获取ios信息')
            })
          })
        } catch (e) {
          console.log(e, 'ios报错')
        }
      }
    }
  }
  
  export default Home
  
  ```

- 运行命令 `npm run dev`，编译完成后在地址栏输入：`http://localhost:9088/home.html`，即可看到 `home` 页面

**至此，使用webpack进行多页面配置，完成！！**

**功能包括：**

- 多页面应用开发配置
- 本地、线上开发、生产，环境配置
- 本地环境使用代理
- 线上开发环境配置aliyun，代码自动上传至服务器
- 生产环境代码优化（压缩、哈希等）
- axios二次封装
- js与app端交互（获取token等信息）
- sass预编译