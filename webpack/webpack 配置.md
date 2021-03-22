# vue 中的 webpack 配置

## publicPath

部署应用包时的基本 URL，这个值也可以被设置为空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径。

> Default: '/'

例如：

```javascript
module.exports = {
  // 基本路径
  publicPath: '/c/'
}
```

那么，我们在使用本地服务器的时候，需要访问  `http://localhost:8080/c/` 

**注意：**

`./` 和 `/` 的区别

-  如果设置 `publicPath = "./"` , 请保证路由页面都是直接引入，而不是含有懒加载，如果含有懒加载的路由，当跳转的时候 部分懒加载路由 会出现跳转失败，实则是资源加载错误。
- 设置 `publicPath = "/"` ，则使用路由懒加载，线上项目也能正常跳转，资源也能正常加载（推荐使用）

## outputDir

输出文件目录，当运行 `vue-cli-service build` 时生成的生产环境构建文件的目录。注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)

> Default: 'dist'

例如：

```javascript
// vue.config.js
module.exports = {
  // 文件打包时，输出文件夹，默认 dist
  outputDir: process.env.NODE_ENV === 'production' ? 'dist_pro' : 'dist_dev'
}
```

```javascript
// package.json

{
    "scripts": {
        "serve": "vue-cli-service serve",
        "build:pro": "vue-cli-service build --mode production",
        "build:test": "vue-cli-service build --mode test",
        "lint": "vue-cli-service lint"
     },
}
```

**注意：**

使用命令进行打包时，我们可以在命令后面添加 `mode test` 来区别 `测试环境打包 / 生产环境打包` ，生产环境打包会进入 `dist_pro` 文件夹，非生产会进入 `dist_dev`

## assetsDir

放置生成的静态资源 (js、css、img、fonts) 的目录

> Default: ' '

例如：

```javascript
// vue.config.js
module.exports = {
  // 打包时，静态资源的输出文件夹
  assetsDir: 'aaaassets'
}
```

## indexPath

指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。

> Default: 'index.html'

例如：

```javascript
// vue.config.js
module.exports = {
  // 指定生成的 index.html 的输出路径 (相对于 outputDir)
  indexPath: 'aaa.html'
}
```

这样，我们在进行打包时，生成的 `html` 容器就变成了：`aaa.html`

## filenameHashing

默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希

> Default: true

## pages

在 multi-page（多页）模式下构建应用。每个“page”应该有一个对应的 JavaScript 入口文件。

> Type: Object
>
> Default: undefined

其值应该是一个对象，对象的 key 是入口的名字，value 是：

> 一个指定了 entry, template, filename, title 和 chunks 的对象 (除了 entry 之外都是可选的)；
>
> 或一个指定其 entry 的字符串。

例如：

```javascript
// vue.config.js
module.exports = {
  // 在 multi-page（多页）模式下构建应用。每个“page”应该有一个对应的 JavaScript 入口文件
  pages: {
    index: {
      // page 的入口文件
      entry: 'src/index/main/js',
      // 模板文件
      template: 'public/index.html',
      // 在dist的输出文件
      filename: 'index.html',
      // 页面标题，当使用titie时，template中的title标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含提取出来的通用chunk和vender-chunk
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // 当使用只有入口的字符串格式时，模板文件默认是 public/page2.html，如果不存在就退回到 public/index.html，输出文件默认是 page2.html
    page2: 'src/page2/main.js'
  }
}
```

## lintOnSave

是否在保存的时候使用 `eslint-loader` 进行检查。 有效的值：`ture` | `false` | `"error"` 当设置为 `"error"` 时，检查出的错误会触发编译失败。

> Default: true

例如：

```javascript
// vue.config.js
module.exports = {
  // 是否在保存的时候使用 eslint-loader 进行检查
  lintOnSave: false
}
```

## runtimeCompiler

是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。

> Default: false

## transpileDependencies

默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。

> Default: []

## productionSourceMap

如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。

> Default: true

## crossorigin

设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。

> Default: undefined

## integrity

在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 [Subresource Integrity](https://links.jianshu.com/go?to=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FSecurity%2FSubresource_Integrity) (SRI)。如果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性。

> Default: false

## configureWebpack

如果这个值是一个对象，则会通过 [webpack-merge](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fsurvivejs%2Fwebpack-merge) 合并到最终的配置中。

如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。

> Type: Object | Function

对象和函数的统一写法：关键词：`Object.assign`

```javascript
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
    } else {
      // 为生产环境修改配置...
      config.mode = 'development'
    }
    // 开发生产共同配置别名
    Object.assign(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@a': path.resolve(__dirname, './src/assets'),
          '@c': path.resolve(__dirname, './src/components'),
        }
      }
    })
  },
```

或者，在函数里面，把要修改的对象 return 出去

```javascript
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
    } else {
      // 为生产环境修改配置...
      config.mode = 'development'
    }

    // 开发生产共同配置别名-方式1
    // const resolve = {
    //   alias: {
    //     '@': path.resolve(__dirname, './src'),
    //     '@a': path.resolve(__dirname, './src/assets'),
    //     '@c': path.resolve(__dirname, './src/components'),
    //   }
    // }
    // return { resolve }

    // 开发生产共同配置别名-方式2
    Object.assign(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@a': path.resolve(__dirname, './src/assets'),
          '@c': path.resolve(__dirname, './src/components'),
        }
      }
    })
  },
```

## chainWebpack

Vue CLI 内部的 webpack 配置是通过 webpack-chain 维护的。这个库提供了一个 webpack 原始配置的上层抽象，使其可以定义具名的 loader 规则和具名插件，并有机会在后期进入这些规则并对它们的选项进行修改。

它允许我们更细粒度的控制其内部配置。

> Type: Function

## css相关配置

例如：

```javascript
// vue.config.js
module.exports = {
  css: {
    modules: false,
    extract: false,
    sourceMap: false,
    loaderOptions: {
      css: {
        // 这里的选项会传递给postcss-loader
      },
      postcss: {
        // 这里的选项会传递给posycss-loader
      }
    }
  }
}
```

### css.modules

默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。设置为 true 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。

> Default: false

### css.extract

是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。

> Type: boolean | Object
>
> Default: 生产环境下是 true，开发环境下是 false

### css.sourceMap

是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能。

> Default: false

### css.loaderOptions

向 CSS 相关的 loader 传递选项。

> Default: {}

支持的 loader 有：

> [css-loader](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fcss-loader)
>
> [postcss-loader](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fpostcss%2Fpostcss-loader)
>
> [sass-loader](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fsass-loader)
>
> [less-loader](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fless-loader)
>
> [stylus-loader](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fshama%2Fstylus-loader)

## devServer

[所有 webpack-dev-server 的选项 ](https://links.jianshu.com/go?to=https%3A%2F%2Fwebpack.js.org%2Fconfiguration%2Fdev-server%2F) 都支持。

例如：

```javascript
// vue.config.js
module.exports = {
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
        target: "https://api.xxxxx.com", // 如果使用代理，配置代理的数据库地址
        changeOrigin: true, // 是否设置同源
        pathRewrite: {
          // 路径重写
          "^/api": "" // 选择忽略拦截器里面的单词
        }
      }
    }
  },
}
```

### devServer.proxy

配置服务器代理

> Type: string | Object

## pluginOptions

这是一个不进行任何 schema 验证的对象，因此它可以用来传递任何第三方插件选项。

> Type: Object

例如：

```javascript
// vue.config.js
module.exports = {
  pluginOptions: {

  }
}
```

