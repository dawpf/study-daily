## uni-app

### 项目搭建

使用编辑器 HBuilderX 直接搭建，可选择多端支持

### 准备

在搭建 H5 和小程序的项目时，需要在 `manifest.json` 中对项目的基本信息进行配置，如小程序的 appid ，H5 的路由模式 等

### 环境配置

`uni-app` 可通过 `process.env.NODE_ENV` 判断当前环境是开发环境还是生产环境，

在 HBuilderX 中，点击 `运行` 编译出来的代码是开发环境，点击 `发行` 编译出来的代码是生产环境

```javascript
if(process.env.NODE_ENV === 'development'){
    console.log('开发环境')
}else{
    console.log('生产环境')
}
```

### 基础配置

#### 1 pages.json

使用框架的路由管理方式 `uni.navigateTo( '/user/...' )` 即可跳转到 `pages.json` 中配置好的页面

```javascript
{
	"pages": [
		// pages数组中第一项表示应用启动页
		{
			"path": "pages/home/index",
			"style": {
				"navigationBarTitleText": "uni-app应用"
			}
		},
		{
			"path": "pages/follow/index",
			"style": {}
		},
		{
			"path": "pages/message/index",
			"style": {}
		},
		{
			"path": "pages/user/index",
			"style": {}
		},
		{
			"path": "pages/more/index",
			"style": {}
		},
		{
			"path": "pages/more/components/image",
			"style": {}
		},
		{
			"path": "pages/more/components/question",
			"style": {}
		},
		{
			"path": "pages/more/components/video",
			"style": {}
		}
	],
  // 以上是:项目里面所有页面的路径，以下可以配置相关的样式 选项栏 等
    
  // globalStyle 用于设置状态栏 导航条 标题 窗口背景色 等样式
	"globalStyle": {
		"navigationBarTextStyle": "black",
		"navigationBarTitleText": "uni-app",
		"navigationBarBackgroundColor": "#F8F8F8",
		"backgroundColor": "#F8F8F8",
		"navigationStyle":"custom"  
    // 值为 custom/false 时，顶部标题栏样式为默认自己设置，可使用第三方插件
	},
  // 底部有切换用的选项卡时使用此属性 tabBar，可配置选项卡名称 icon 背景色 等样式
	"tabBar": {
		"borderStyle": "black",
		"backgroundColor": "#333",
		"color": "#8F8F94",
		"selectedColor": "#f33e54",
		"list": [{
				"pagePath": "pages/home/index",
				"iconPath": "static/img/tabbar/home.png",
				"selectedIconPath": "static/img/tabbar/homeactive.png",
				"text": "首页"
			},
			{
				"pagePath": "pages/follow/index",
				"iconPath": "static/img/tabbar/guanzhu.png",
				"selectedIconPath": "static/img/tabbar/guanzhuactive.png",
				"text": "关注"
			},
			//#ifdef MP-WEIXIN
			{
				"pagePath": "pages/more/index",
				"iconPath": "static/img/tabbar/add.png",
				"selectedIconPath": "static/img/tabbar/addactive.png",
				"text": "发布"
			},
			//#endif
			//#ifndef MP-WEIXIN
			{
				"pagePath": "pages/more/index",
				"iconPath": "static/img/tabbar/add.png",
				"selectedIconPath": "static/img/tabbar/addactive.png"
			},
			//#endif
			{
				"pagePath": "pages/message/index",
				"iconPath": "static/img/tabbar/news.png",
				"selectedIconPath": "static/img/tabbar/newsactive.png",
				"text": "消息"
			},
			{
				"pagePath": "pages/user/index",
				"iconPath": "static/img/tabbar/me.png",
				"selectedIconPath": "static/img/tabbar/meactive.png",
				"text": "我"
			}
		]
	}
}
```

#### 2 package.json

一般在安装第三方依赖的时候会生成这个文件，里面可以展示依赖的安装信息

#### 3 vue.config.js

vue项目配置文件，在uni-app中，有些属性不适用

#### 4 main.js

项目的入口文件，主要作用是初始化 vue 实例、定义全局组件、使用需要的插件如vuex。

### 生命周期

- `onLaunch`  当 `uni-app` 初始化完成时触发（全局只触发一次）
- `onShow` 当 `uni-app` 启动，或从后台进入前台显示
- `onHide` 当 `uni-app` 从前台进入后台

```html
<script>
    export default {
        onLaunch: function() {
            console.log('App Launch')
        },
        onShow: function() {
            console.log('App Show')
        },
        onHide: function() {
            console.log('App Hide')
        }
    }
</script>
```

### 路由管理

使用 uni-app 框架定义好的路由管理方式进行路由的跳转

- `uni.navigateTo( { url : '/news' } )` 跳转到应用内的某个页面，使用`uni.navigateBack`可以返回到原页面。
- `uni.redirectTo( { url : '/news' } )` 关闭当前页面，跳转到应用内的某个页面。
- `uni.reLaunch( { url : '/news' } )` 关闭所有页面，打开到应用内的某个页面。
- `uni.switchTab( { url : '/news' } )` 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
- `uni.navigateBack( { delta: 2 } )` 关闭当前页面，返回上一页面或多级页面。可通过 `getCurrentPages()` 获取当前的页面栈，决定需要返回几层。

### 状态管理

uni-app 框架内置了 vuex，只需要引入即可

根目录下新建 store/index.js

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
		user:'zs'
	},
    mutations: {
		changeUser(state,val){
			state.user = val
		}
	},
    actions: {
		changeUser_action(connect,val){
			connect.dispatch('changeUser',val)
		}
	}
})
export default store
```

main.js 中引入

```javascript
import Vue from 'vue'
import App from './App'
import store from "./store/index.js"

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,store
})
app.$mount()
```

然后就可以和在 vue 项目中 一样的方法获取状态，调用方法改变状态

### request 封装

#### 1 原生 request

新建 utils/request.js 文件

```javascript

// 配置 生产环境/开发环境 基础地址
let baseURL 
if(process.env.NODE_ENV === 'development'){
    console.log('开发环境')
	baseURL = 'https://www.development.com'
	// https://easy-mock.bookset.io/mock/5e90379d00bfc566e5bb1acb/example
}else{
    console.log('生产环境')
	baseURL = 'https://www.production.com'
}

// 配置 请求头
const header = {
	'token':'123456'
}

export function get( url , params ){
	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://easy-mock.bookset.io/mock/5e90379d00bfc566e5bb1acb/example${url}`, //仅为示例，并非真实接口地址。
			data: { ...params },
			header: {
				'custom-header': 'hello' ,//自定义请求头信息,
				...header
			},
			success: (res) => {
				resolve(res.data)
			},
			fail: (err) => {
				reject(err.data)
			}
		});
	});
}
... post 方法
```

新建 api/home.js 文件

```javascript
// home 模块api

import {get} from "../utills/request.js"

export function getMockData() {
  return get('/mock')
}
```

**或直接使用插件库里面的插件，按照步骤引入使用就可以**

#### 2 插件引入 request 方法

新建 utils/request 文件夹，其中

##### request.js

Request 文件夹下，封装的请求的基本方法：

```javascript
const qiniuUploader = require("./qiniuUploader");
export default class request {
	constructor(options) {
		//请求公共地址
		this.baseUrl = options.baseUrl || "";
		//公共文件上传请求地址
		this.fileUrl = options.fileUrl || "";
		//默认请求头
		this.headers = options.headers || {};
		//默认配置
		this.config = {
			isPrompt: options.isPrompt === false ? false : true,
			load: options.load === false ? false : true,
			isFactory: options.isFactory === false ? false : true,
			loadMore: options.loadMore === false ? false : true
		};
	}
	// 获取默认信息
	getDefault(url, options, type) {
		//判断url是不是链接
		var urlType = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~/])+$/.test(url);
		let httpUrl;
		if (type == "file") {
			httpUrl = urlType ? url : this.fileUrl + url;
		} else {
			httpUrl = urlType ? url : this.baseUrl + url;
		}
		let config = Object.assign({}, this.config, options);
		//请求地址
		config.httpUrl = httpUrl;
		//请求头
		config.headers = Object.assign(this.headers, options.headers);
		return config;
	}

	//post请求
	post(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "data");
		requestInfo.data = data;
		return new Promise((resolve, reject) => {
			this.getRequest("POST", requestInfo, (state, response) => {
				//是否用外部的数据处理方法
				if (state && requestInfo.isFactory && this.dataFactory) {
					//数据处理
					this.dataFactory({
						...requestInfo,
						response:response,
						resolve:resolve,
						reject:reject
					});
				} else {
					state ? resolve(response) : reject(response);
				}
			});
		});
	}
	//get请求
	get(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "data");
		requestInfo.data = data;
		return new Promise((resolve, reject) => {
			this.getRequest("GET", requestInfo, (state, response) => {
				//是否用外部的数据处理方法
				if (state && requestInfo.isFactory && this.dataFactory) {
					//数据处理
					this.dataFactory({
						...requestInfo,
						response:response,
						resolve:resolve,
						reject:reject
					});
				} else {
					state ? resolve(response) : reject(response);
				}
			});
		});
	}
	//put请求
	put(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "data");
		requestInfo.data = data;
		return new Promise((resolve, reject) => {
			this.getRequest("PUT", requestInfo, (state, response) => {
				//是否用外部的数据处理方法
				if (state && requestInfo.isFactory && this.dataFactory) {
					//数据处理
					this.dataFactory({
						...requestInfo,
						response:response,
						resolve:resolve,
						reject:reject
					});
				} else {
					state ? resolve(response) : reject(response);
				}
			});
		});
	}
	//delete请求
	delete(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "data");
		requestInfo.data = data;
		return new Promise((resolve, reject) => {
			this.getRequest("DELETE", requestInfo, (state, response) => {
				//是否用外部的数据处理方法
				if (state && requestInfo.isFactory && this.dataFactory) {
					//数据处理
					this.dataFactory({
						...requestInfo,
						response:response,
						resolve:resolve,
						reject:reject
					});
				} else {
					state ? resolve(response) : reject(response);
				}
			});
		});
	}

	//接口请求方法
	getRequest(ajaxType, options, callback) {
		//请求前回调
		if (this.requestStart) {
			options.method = ajaxType;
			var requestStart = this.requestStart(options);
			if (typeof requestStart == "object") {
				options.data = requestStart.data;
				options.headers = requestStart.headers;
				options.isPrompt = requestStart.isPrompt;
				options.load = requestStart.load;
				options.isFactory = requestStart.isFactory;
			} else {
				callback(false, "请求开始拦截器未通过");
				return;
			}
		}
		uni.request({
			url: options.httpUrl,
			data: options.data,
			method: ajaxType, //请求类型
			header: options.headers, //加入请求头
			success: (res) => {
				//请求完成回调
				this.requestEnd && this.requestEnd(options, res);
				callback(true, res);
			},
			fail: (err) => {
				//请求完成回调
				this.requestEnd && this.requestEnd(options, err);
				callback(false, err);
			}
		});
	}
	//jsonp请求(只限于H5使用)
	jsonp(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "data");
		let dataStr = '';
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		});
		//匹配最后一个&并去除
		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
		}
		requestInfo.httpUrl = requestInfo.httpUrl + '?' + dataStr;
		const _this = this;
		return new Promise((resolve, reject) => {
			let callbackName = "callback" + Math.ceil(Math.random() * 1000000);
			if (_this.requestStart) {
				requestInfo.data = data;
				var requestStart = _this.requestStart(requestInfo);
				if (typeof requestStart == "object") {
					requestInfo.data = requestStart.data;
					requestInfo.headers = requestStart.headers;
					requestInfo.isPrompt = requestStart.isPrompt;
					requestInfo.load = requestStart.load;
					requestInfo.isFactory = requestStart.isFactory;
				} else {
					reject("请求开始拦截器未通过");
					return;
				}
			}
			window[callbackName] = function (data) {
				resolve(data);
			}
			var script = document.createElement("script");
			script.src = requestInfo.httpUrl + "&callback=" + callbackName;
			document.head.appendChild(script);
			// 及时删除，防止加载过多的JS
			document.head.removeChild(script);
			//请求完成回调
			_this.requestEnd && _this.requestEnd(requestInfo, {});
		});
	}
	//七牛云上传图片
	qnImgUpload(options = {}, callback) {
		const _this = this;
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: options.count || 9, //默认9
				sizeType: options.sizeType || ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: options.sourceType || ['album', 'camera'], //从相册选择
				success: function (res) {
					_this.qnFileUpload(res.tempFilePaths, callback).then(data => {
						resolve(data);
					}, err => {
						reject(err);
					});
				}
			});
		});
	}
	//七牛云上传文件命名
	randomChar(l, url = "") {
		const x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
		var tmp = "";
		var time = new Date();
		for (var i = 0; i < l; i++) {
			tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
		}
		return (
			"file/" +
			url +
			time.getTime() +
			tmp
		);
	}
	//七牛云文件上传（支持多张上传）
	qnFileUpload(files, callback) {
		const _this = this;
		return new Promise((resolve, reject) => {
			if (typeof (files) == "object") {
				var len = files.length;
				var imageList = new Array;
				//该地址需要开发者自行配置（每个后台的接口风格都不一样）
				_this.get("api/kemean/aid/qn_upload").then(data => {
					/*
					*接口返回参数：
					*visitPrefix:访问文件的域名
				    *token:七牛云上传token
				    *folderPath:上传的文件夹
				    */
					uploadFile(0);
					function uploadFile(i) {
						// 交给七牛上传
						qiniuUploader.upload(files[i], (res) => {
							callback && callback(res.imageURL);
							imageList.push(res.imageURL);
							if (len - 1 > i) {
								uploadFile(i + 1);
							} else {
								resolve(imageList);
							}
						}, (error) => {
							console.log('error: ' + error);
							reject(error)
						}, {
							region: 'SCN', //地区
							domain: data.visitPrefix, // // bucket 域名，下载资源时用到。
							key: _this.randomChar(8, data.folderPath),
							uptoken: data.token, // 由其他程序生成七牛 uptoken
							uptokenURL: 'UpTokenURL.com/uptoken' // 上传地址
						}, (res) => {
							console.log('上传进度', res.progress)
							// console.log('已经上传的数据长度', res.totalBytesSent)
							// console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
						});
					}
				});
			} else {
				console.error("files 必须是数组类型");
				reject("files 必须是数组类型")
			}
		});

	}
	//本地服务器图片上传
	urlImgUpload(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "file");
		requestInfo.data = data;
		const _this = this;
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: data.count || 9, //默认9
				sizeType: data.sizeType || ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: data.sourceType || ['album', 'camera'], //从相册选择
				success: function (res) {
					_this.urlFileUpload(requestInfo, res.tempFiles, (state, response) => {
						state ? resolve(response) : reject(response);
					});
				}
			});
		});
	}
	//本地服务器文件上传方法
	urlFileUpload(options, files, callback) {
		const _this = this;
		//请求前回调
		if (this.requestStart) {
			options.method = "FILE";
			var requestStart = this.requestStart(options);
			if (typeof requestStart == "object") {
				if (typeof requestStart == "object") {
					options.data = requestStart.data;
					options.headers = requestStart.headers;
					options.isPrompt = requestStart.isPrompt;
					options.load = requestStart.load;
					options.isFactory = requestStart.isFactory;
				} else {
					callback(false, "请求开始拦截器未通过");
					return;
				}
			}
		}
		const len = files.length - 1;
		let fileList = new Array;
		fileUpload(0);
		function fileUpload(i) {
			var config = {
				url: options.httpUrl,
				filePath: files[i].path,
				header: options.headers, //加入请求头
				name: options.name || "file",
				success: (response) => {
					response.data = JSON.parse(response.data);
					//请求完成回调
					_this.requestEnd && _this.requestEnd(options, response);
					//是否用外部的数据处理方法
					if (options.isFactory && _this.dataFactory) {
						//数据处理
						var factoryInfo = _this.dataFactory(options, response);
						if (factoryInfo.success) {
							fileList.push(factoryInfo.result);
							if (len <= i) {
								callback(true, fileList);
							} else {
								fileUpload(i + 1);
							}
						} else {
							callback(false, factoryInfo.result);
						}
					} else {
						fileList.push(response.data);
						if (len <= i) {
							callback(true, fileList);
						} else {
							fileUpload(i + 1);
						}
					}
				},
				fail: (err) => {
					//请求完成回调
					_this.requestEnd && _this.requestEnd(options, err);
					callback(false, err);
				}
			};
			if (options.data) {
				config.formData = options.data;
			}
			uni.uploadFile(config);
		}
	}
}
```

##### requestConfig.js

request 文件夹下，对请求方法进行配置

```javascript
import request from "./request";

// 根据 生产环境/开发环境 配置基础地址
let baseUrl 
if(process.env.NODE_ENV === 'development'){
  console.log('开发环境')
	baseUrl = 'https://www.development.com'
	// https://easy-mock.bookset.io/mock/5e90379d00bfc566e5bb1acb/example // 示例网址
}else{
  console.log('生产环境')
	baseUrl = 'https://www.production.com'
}

//可以new多个request来支持多个域名请求
let $http = new request({
	//接口请求地址
	baseUrl: baseUrl,
	//服务器本地上传文件地址
	fileUrl: baseUrl,
	//设置请求头（如果使用报错跨域问题，可能是content-type请求类型和后台那边设置的不一致）
	headers: {
		'content-type': 'application/json;charset=UTF-8'
	},
	//以下是默认值可不写
	//是否提示--默认提示
	isPrompt: true,
	//是否显示请求动画
	load: true,
	//是否使用处理数据模板
	isFactory:  true
});
//当前接口请求数
let requestNum = 0;
//请求开始拦截器
$http.requestStart = function (options) {
	if (requestNum <= 0) {
		uni.showNavigationBarLoading();
		if (options.load) {
			// #ifndef APP-PLUS
			//打开加载动画
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			// #endif
		}
	}
	requestNum += 1;
	//请求前加入token
	options.headers['token'] = "1234568";
	return options;
}
//请求结束
$http.requestEnd = function (options, resolve) {
	//判断当前接口是否需要加载动画
	requestNum = requestNum - 1;
	if (requestNum <= 0) {
		uni.hideLoading();
		uni.hideNavigationBarLoading();
	}
	if (resolve.errMsg && (resolve.errMsg != "request:ok" || resolve.statusCode && resolve.statusCode != 200)) {
		setTimeout(() => {
			uni.showToast({
				title: "网络错误，请检查一下网络",
				icon: "none"
			});
		}, 500);
	}
}
//登录弹窗次数
let loginPopupNum = 0;
//所有接口数据处理（可在接口里设置不调用此方法）
//此方法需要开发者根据各自的接口返回类型修改，以下只是模板
$http.dataFactory = function (res) {
	console.log("接口请求数据", {
		httpUrl:res.httpUrl,
		resolve:res.response,
		headers:res.headers,
		data:res.data,
		method:res.method,
	});
	// 判断接口请求是否成功
	if (res.response.statusCode && res.response.statusCode == 200) {
		let httpData = res.response.data;
		
		/*********以下只是模板(及共参考)，需要开发者根据各自的接口返回类型修改*********/
		
		//判断数据是否请求成功
		if (httpData.success) {
			// 返回正确的结果(then接受数据)
			res.resolve(httpData.data);
		} else if (httpData.code == "1000" || httpData.code == "1001") { //未登录或登录已失效
			if (loginPopupNum <= 0) {
				loginPopupNum++;
				uni.showModal({
					title: '温馨提示',
					content: '此时此刻需要您登录喔~',
					confirmText: "去登录",
					cancelText: "再逛会",
					success: res2 => {
						loginPopupNum--;
						if (res.confirm) {
							uni.navigateTo({
								url:"'/pages/login"
							});
						}
					}
				});
			}
		} else { //其他错误提示
			if (res.isPrompt) { //设置可以提示的时候
				setTimeout(function () {
					uni.showToast({
						title: httpData.info, //提示后台接口抛出的错误信息
						icon: "none",
						duration: 3000
					});
				}, 500);
			}
			// 返回错误的结果(catch接受数据)
			res.reject(httpData);
		}
		
		/*********以上只是模板(及共参考)，需要开发者根据各自的接口返回类型修改*********/
		
	}else{
		// 返回错误的结果(catch接受数据)
		res.reject(res.response);
	}
};
export default $http;

```

##### qiniuUploader.js

request 文件夹下，七牛云官方上传文件

```javascript
// created by gpake
(function () {

  var config = {
    qiniuRegion: '',
    qiniuImageURLPrefix: '',
    qiniuUploadToken: '',
    qiniuUploadTokenURL: '',
    qiniuUploadTokenFunction: null,
    qiniuShouldUseQiniuFileName: false
  }

  module.exports = {
    init: init,
    upload: upload,
  }

  // 在整个程序生命周期中，只需要 init 一次即可
  // 如果需要变更参数，再调用 init 即可
  function init(options) {
    config = {
      qiniuRegion: '',
      qiniuImageURLPrefix: '',
      qiniuUploadToken: '',
      qiniuUploadTokenURL: '',
      qiniuUploadTokenFunction: null,
      qiniuShouldUseQiniuFileName: false
    };
    updateConfigWithOptions(options);
  }

  function updateConfigWithOptions(options) {
    if (options.region) {
      config.qiniuRegion = options.region;
    } else {
      console.error('qiniu uploader need your bucket region');
    }
    if (options.uptoken) {
      config.qiniuUploadToken = options.uptoken;
    } else if (options.uptokenURL) {
      config.qiniuUploadTokenURL = options.uptokenURL;
    } else if (options.uptokenFunc) {
      config.qiniuUploadTokenFunction = options.uptokenFunc;
    }
    if (options.domain) {
      config.qiniuImageURLPrefix = options.domain;
    }
    config.qiniuShouldUseQiniuFileName = options.shouldUseQiniuFileName
  }

  function upload(filePath, success, fail, options, progress, cancelTask) {
    if (null == filePath) {
      console.error('qiniu uploader need filePath to upload');
      return;
    }
    if (options) {
      updateConfigWithOptions(options);
    }
    if (config.qiniuUploadToken) {
      doUpload(filePath, success, fail, options, progress, cancelTask);
    } else if (config.qiniuUploadTokenURL) {
      getQiniuToken(function () {
        doUpload(filePath, success, fail, options, progress, cancelTask);
      });
    } else if (config.qiniuUploadTokenFunction) {
      config.qiniuUploadToken = config.qiniuUploadTokenFunction();
      if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
        console.error('qiniu UploadTokenFunction result is null, please check the return value');
        return
      }
      doUpload(filePath, success, fail, options, progress, cancelTask);
    } else {
      console.error('qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]');
      return;
    }
  }

  function doUpload(filePath, success, fail, options, progress, cancelTask) {
    if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
      console.error('qiniu UploadToken is null, please check the init config or networking');
      return
    }
    var url = uploadURLFromRegionCode(config.qiniuRegion);
    var fileName = filePath.split('//')[1];
    if (options && options.key) {
      fileName = options.key;
    }
    var formData = {
      'token': config.qiniuUploadToken
    };
    if (!config.qiniuShouldUseQiniuFileName) {
      formData['key'] = fileName
    }
    var uploadTask = uni.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      formData: formData,
      success: function (res) {
        var dataString = res.data
        if (res.data.hasOwnProperty('type') && res.data.type === 'Buffer') {
          dataString = String.fromCharCode.apply(null, res.data.data)
        }
        try {
          var dataObject = JSON.parse(dataString);
          //do something
          var imageUrl = config.qiniuImageURLPrefix + '/' + dataObject.key;
          dataObject.imageURL = imageUrl;
          if (success) {
            success(dataObject);
          }
        } catch (e) {
          console.log('parse JSON failed, origin String is: ' + dataString)
          if (fail) {
            fail(e);
          }
        }
      },
      fail: function (error) {
        console.error(error);
        if (fail) {
          fail(error);
        }
      }
    })

    uploadTask.onProgressUpdate((res) => {
      progress && progress(res)
    })

    cancelTask && cancelTask(() => {
      uploadTask.abort()
    })
  }

  function getQiniuToken(callback) {
    uni.request({
      url: config.qiniuUploadTokenURL,
      success: function (res) {
        var token = res.data.uptoken;
        if (token && token.length > 0) {
          config.qiniuUploadToken = token;
          if (callback) {
            callback();
          }
        } else {
          console.error('qiniuUploader cannot get your token, please check the uptokenURL or server')
        }
      },
      fail: function (error) {
        console.error('qiniu UploadToken is null, please check the init config or networking: ' + error);
      }
    })
  }

  function uploadURLFromRegionCode(code) {
    var uploadURL = null;
    switch (code) {
      case 'ECN': uploadURL = 'https://up.qbox.me'; break;
      case 'NCN': uploadURL = 'https://up-z1.qbox.me'; break;
      case 'SCN': uploadURL = 'https://up-z2.qbox.me'; break;
      case 'NA': uploadURL = 'https://up-na0.qbox.me'; break;
      case 'ASG': uploadURL = 'https://up-as0.qbox.me'; break;
      default: console.error('please make the region is with one of [ECN, SCN, NCN, NA, ASG]');
    }
    return uploadURL;
  }

})();
```

##### 使用

在 api/home.js 文件中

```javascript
import request from "../js_sdk/zhouWei-request/requestConfig.js"

export function getMockData_chajian(){
  return request.get('/mock')
}

export function ...
```

这样，在页面中就可以使用 getMockData_chajian 方法来获取数据

```html
<template>
	<view class="content">
		这是首页
	</view>
</template>

<script>
import { getMockData_chajian } from "../../api/home.js"

export default {
	data() {
		return { };
	},
	computed:{ },
	components:{ },
	async onLoad() {
     try{
       let res = await getMockData_chajian()  // 获取数据
       console.log('使用插件获取到的数据,',res);
     }catch(e){
       console.log(e);
     }
	},
	methods: { }
};
</script>
```

##### 文档指南

~~~markdown
# request请求、配置简单、源码清晰注释多、超强的适应性（很方便的支持多域名请求）
1. 配置简单、源码清晰注释多、适用于一项目多域名请求、第三方请求、七牛云图片上传、本地服务器图片上传等等
2. 支持请求`get`、`post`、`put`、`delete`
3. 自动显示请求加载动画（可单个接口关闭）
4. 全局`api`数据处理函数，只回调请求正确的数据（可单个接口关闭）
5. 未登录或登录失效自动拦截并调用登录方法（可单个接口关闭）
6. 全局自动提示接口抛出的错误信息（可单个接口关闭）
7. 支持 Promise
8. 支持拦截器

### QQ交流群 607391225
![QQ交流群](http://qn.kemean.cn//upload/202004/14/15868301778472k7oubi6.png)

# 文件说明
1. `request.js` 源码文件
2. `requestConfig.js` 请求配置文件（具体看代码）
3. `qiniuUploader.js` 七牛云官方上传文件

# 常见问题
1. 接口请求成功了，没有返回数据或者数据是走的catch回调
答：`requestConfig.js` 请求配置文件里面，有一个`$http.dataFactory`方法，里面写的只是参考示例，`此方法需要开发者根据各自的接口返回类型修改`

2. 官方的方法有数据，本插件方法请求报错跨域问题
答：`requestConfig.js` 请求配置文件里面，`headers`请求头设置的`content-type`请求类型需求和后台保持一致

3. 登录后用户`token`怎么设置？
答：`requestConfig.js` 请求配置文件里面，`$http.requestStart`请求开始拦截器里面设置

# 在main.js引入并挂在Vue上
```
import $http from '@/zhouWei-request/requestConfig';
Vue.prototype.$http = $http;
```

# get请求 正常写法 
```
this.$http.get('aid/region',{pid:0}).
then(function (response) {
	//这里只会在接口是成功状态返回
}).catch(function (error) {
	//这里只会在接口是失败状态返回，不需要去处理错误提示
	console.log(error);
});
```

# post请求 async写法 
```
async request(){
	let data = await this.$http.post('aid/region',{pid:0});
	console.log(data);
}
```

# 其他功能配置项
```
let data = await this.$http.post(
	'http://www.aaa.com/aid/region', //可以直接放链接(将不启用全局定义域名)
	{
		pid:0
	}, 
	{
		isPrompt: true,//（默认 true 说明：本接口抛出的错误是否提示）
		load: true,//（默认 true 说明：本接口是否提示加载动画）
		headers: { //默认 无 说明：请求头
			'Content-Type': 'application/json'
		},
		isFactory: true //（默认 true 说明：本接口是否调用公共的数据处理方法，设置false后isPrompt参数奖失去作用）
	}
);
```

# 本地服务器图片上传（支持多张上传）
```
let data = await this.$http.urlImgUpload('flie/upload',{
	name:"后台接受文件key名称", //默认 file
	count:"最大选择数",//默认 9
	sizeType:"选择压缩图原图，默认两个都选",//默认 ['original', 'compressed']
	sourceType:"选择相机拍照或相册上传 默认两个都选",//默认 ['album','camera']
	data:"而外参数" //可不填
});
```
# 本地服务器文件上传（支持多张上传）
```
this.$http.urlFileUpload({
		data:"向服务器传递的参数", //可不填
		name:"后台接受文件key名称", //默认 file
	},
	[], // 必填 临时文件路径
	(res) => {
		//这里是上传完成了数据数组
	}
);
```

# 七牛云图片上传（支持多张上传）
```
let data = await this.$http.qnImgUpload({ 
		count:"最大选择数",//默认 9
		sizeType:"选择压缩图原图，默认两个都选",//默认 ['original', 'compressed']
		sourceType:"选择相机拍照或相册上传 默认两个都选",//默认 ['album','camera']
	},
	(res) => {
		//这里是每上传一张都返回一张图片地址
	}
);
```

# 七牛云文件上传（支持多张上传）
```
let data = await this.$http.qnFileUpload(
	[], // 必填 临时文件路径
	(res) => {
		//这里是每上传一张都返回一张图片地址
	}
);
```
# jsonp 跨域请求（只支持H5）
```
let data = await this.$http.jsonp('http://www.aaa.com/aid/region',{pid:0});
```
~~~

**然后在页面中就能使用 getMockData 方法来获取数据了**

