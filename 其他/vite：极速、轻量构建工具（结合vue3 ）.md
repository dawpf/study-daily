## 1.创建一个vite项目

```bash
npm init vite-app <project-name>
cd <project-name>
npm install 
npm run dev
```

或者

```bash
yarn create vite-app <project-name>
cd <project-name>
yarn 
yarn dev
```

## 2.vite简介

**vite 是一个基于 Vue3 单文件组件的非打包开发服务器**，它做到了本地快速开发启动：

1. 快速的冷启动，不需要等待打包操作；
2. 即时的热模块更新，替换性能和模块数量的解耦让更新飞起；
3. 真正的按需编译，不再等待整个应用编译完成，这是一个巨大的改变。

**并且vite也成功地革了webpack的命，让webpack开发者直接喊大哥：**

<img src="https:////upload-images.jianshu.io/upload_images/19393878-06a849e64e8bdc17.png?imageMogr2/auto-orient/strip|imageView2/2/w/690/format/webp" alt="img" style="zoom:80%;" />

**尤神放弃webpack**

那么vite是如何做到这些的呢？

## 3.第一个疑问

通过运行`npm run dev`，可以观察到这个项目是秒级打开，打开调试器可以看到：

![img](https:////upload-images.jianshu.io/upload_images/19393878-60f2a74bcb77bc3f.png?imageMogr2/auto-orient/strip|imageView2/2/w/309/format/webp)

模块请求

浏览器直接请求了`.vue`文件，并且后面带了一些type参数。点击这些请求，简单查看一下文件返回内容：

```js
//main.js
import { createApp } from '/@modules/vue.js'        
import App from '/src/App.vue'    //
import '/src/index.css?import'      //

createApp(App).mount('#app')
```

最直观地看到这里：

- 将vue引用转化为`/@modules/vue.js`
- 将`./App.vue`转换为`/src/App.vue`
- 将`./index.css`转化为`/src/index.css?import`

```js
//HelloWorld.vue?type=style&index=0
import { updateStyle } from "/vite/hmr"
const css = "\np{color: red;}\n"
updateStyle("62a9ebed-0", css)
export default css
```

这里编译了Helloworld.vue中的style样式，将 `p{color:red}`进行了编译；

```js
//index.css?import
import { updateStyle } from "/vite/hmr"
const css = "#app {\n  font-family: Avenir, Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #2c3e50;\n  margin-top: 60px;\n}\n"
updateStyle("\"2418ba23\"", css)
export default css
```

同时还对全局样式进行了更新监听。

既然浏览器直接请求了`.vue` 文件，那么文件内容是如何做出解析的呢。**项目是如何在不使用webpack等打包工具的条件下如何直接运行vue文件。**

### 3.1挖掘vite运行原理

从上面的代码片段中可以看到，最明显的特征就是使用了**ES Module**,代码以模块的形式引入到文件，同时实现了按需加载。

其最大的特点是在浏览器端使用 `export import` 的方式导入和导出模块，在 script 标签里设置 `type="module"` ，然后使用 **ES module**。

正因如此，vite高度依赖`module script`特性，也就意味着从这里开始抛弃了IE市场，参见[Javascript MDN](https://links.jianshu.com/go?to=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FGuide%2FModules)。

在这种操作下，伴随的另一个效果就是去掉了webpack打包步骤，不用再将各个模块文件打包成一个bundle，以便支持浏览器的模块化加载。那么**vite是如何处理这些模块**的呢？

关键在于vite使用`Koa`构建的服务端，在`createServer`中主要通过中间件注册相关功能。

vite 对 `import` 都做了一层处理，其过程如下：

1. 在 koa 中间件里获取请求 body
2. 通过 [es-module-lexer](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fes-module-lexer) 解析资源 ast 拿到 import 的内容
3. 判断 import 的资源是否是绝对路径，绝对视为 npm 模块
4. 返回处理后的资源路径，例如：`"vue" => "/@modules/vue"`

将处理的template,script,style等所需的依赖以http请求的形式，通过query参数形式区分并加载SFC文件各个模块内容。

为什么这里需要`@modules`?

举个栗子：

```js
import vue from 'vue'
```

vue模块安装在`node_modules`中，浏览器`ES Module`是无法直接获取到项目下node_modules目录中的文件。所以`vite`对`import`都做了一层处理，重写了前缀使其带有`@modules`，以便项目访问引用资源；另一方面，把文件路径都写进同一个@modules中，类似面向切片编程，可以从中再进行其他操作而不影响其他部分资源，比如后续可加入alias等其他配置。

通过koa middleware正则匹配上带有`@modules`的资源，再通过require('XXX')获取到导出资源并返给浏览器。

### 3.2文件请求

单页面文件的请求有个特点，都是以`*.vue`作为请求路径结尾，当服务器接收到这种特点的http请求，主要处理

- 根据`ctx.path`确定请求具体的vue文件
- 使用`parseSFC`解析该文件，获得`descriptor`，一个`descriptor`包含了这个组件的基本信息，包括`template`、`script`和`styles`等属性 下面是`Comp.vue`文件经过处理后获得的`descriptor`

然后根据`descriptor`和`ctx.query.type`选择对应类型的方法，处理后返回`ctx.body`

- type为空时表示处理`script`标签，使用`compileSFCMain`方法返回`js`内容
- type为`template`时表示处理`template`标签，使用`compileSFCTemplate`方法返回`render`方法
- type为`style`s时表示处理`style`标签，使用`compileSFCStyle`方法返回`css`文件内容

在浏览器里使用 ES module 是使用 http 请求拿到的模块，所以 vite 必须提供一个`web server` 去代理这些模块，上文中提到的 `koa中间件` 就是负责这个事情，vite 通过对请求路径`query.type`的劫持获取资源的内容返回给浏览器，然后通过拼接不同的处理单页面文件解析后的各个资源文件，最后响应给浏览器进行渲染。

从另一方面来看，这也是一个非常有趣的方法，webpack之类的打包工具会把各种各样的模块提前打包进bundle中，但打包结果是静态的，不管某个模块的代码是否用得到，它都要被打包进去，显而易见的坏处就是随着项目越来越大，打包文件也越来越大。vite的优雅之处就在于需要某个模块时动态引入，而不是提前打包，自然而然提高了开发体验。

## 4.hmr热更新

vite的热更新主要有四步：

1. 通过 watcher 监听文件改动；
2. 通过 server 端编译资源，并推送新资源信息给 client ；
3. 需要框架支持组件 rerender/reload ；
4. client 收到资源信息，执行框架 rerender 逻辑。

在client端，Websocket监听了一些更新的消息类型，然后分别处理：

- **vue-reload** —— vue 组件更新：通过 import 导入新的 vue 组件，然后执行 `HMRRuntime.reload`
- **vue-rerender** —— vue template 更新：通过 import 导入新的 template ，然后执行 `HMRRuntime.rerender`
- **vue-style-update** —— vue style 更新：直接插入新的 stylesheet
- **style-update** —— css 更新：document 插入新的 stylesheet
- **style-remove** —— css 移除：document 删除 stylesheet
- **js-update** —— js 更新：直接执行
- **full-reload** —— 页面 roload：使用 `window.reload` 刷新页面

在server端，通过watcher监听页面改动，根据文件类型判断是js Reload还是vue Reload。通过解析器拿到当前文件内容，并与缓存里的上一次解析结果进行比较，如果发生改变则执行相应的render。

## 5.后续

本文简述了`vite`的启动链路和背后的简易原理，虽然短时间内`vite`不会替代`webpack`，但是能够看到`vite`的强大潜力和不可阻挡的趋势。



作者：前端优选
链接：https://www.jianshu.com/p/07960e4bbb01
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。