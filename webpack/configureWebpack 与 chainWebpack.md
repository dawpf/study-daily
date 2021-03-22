# configureWebpack 与 chainWebpack

## configureWebpack 

该对象将会被 `webpack-merge` 合并入最终的 `webpack` 配置。
如果你需要基于环境有条件地配置行为，或者想要直接修改配置，那就换成一个函数 (该函数会在环境变量被设置之后懒执行)。该方法的第一个参数会收到已经解析好的配置。在函数内，你可以直接修改配置，或者返回一个将会被合并的对象：

**对象式写法：**

```javascript
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir)
}

function getPlugins() {
  let plugins = []
  if (process.env.VUE_APP_ENV === 'test') {
    plugins.push(
      // 添加插件
    )
  }
  if (process.env.VUE_APP_ENV === 'production') {
    plugins.push(
      // 添加插件
    )
  }
  return plugins
}

module.exports = {
  publicPath: "/",
  lintOnSave: false,
  devServer: {
    // 配置服务器
    port: 8086,
    open: true,
  },
  configureWebpack: {
    // 覆盖webpack默认配置的都在这里
    resolve: {
      // 配置解析别名其中:@代表根目录，@c代表 src/components 文件夹，等
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@a": path.resolve(__dirname, "./src/assets"),
        "@c": path.resolve(__dirname, "./src/components"),
      }
    }
    plugins: getPlugins()
  },
};

```

**函数式写法：**

```javascript
// vue.config.js

const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir)
}
function getPlugins() {
  let plugins = []
  if (process.env.VUE_APP_ENV === 'test') {
    plugins.push(
      // 添加插件
    )
  }
  if (process.env.VUE_APP_ENV === 'production') {
    plugins.push(
      // 添加插件
    )
  }
  return plugins
}

module.exports = {
  publicPath: "/",
  lintOnSave: false,
  devServer: {
    // 配置服务器
    port: 8086,
    open: true,
  },
  configureWebpack: (config) => {

    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
    } else {
      // 为开发环境修改配置...
      config.mode = 'development'
    }

    // 方式1：
    // Object.assign(config, {
    //   resolve: {
    //     alias: {
    //       '@': path.resolve(__dirname, './src'),
    //       '@a': path.resolve(__dirname, './src/assets'),
    //       '@c': path.resolve(__dirname, './src/components'),
    //     }
    //   }
    //   plugins: getPlugins()
    // })

    // 方式2：
    const name = '111'
    const resolve = {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@a': path.resolve(__dirname, './src/assets'),
        '@c': path.resolve(__dirname, './src/components'),
      }
    }
    const plugins = getPlugins()
    return { name, resolve, plugins }
  }
};

```

## chainWebpack

Vue CLI 内部的 `webpack` 配置是通过 `webpack-chain` 维护的。这个库提供了一个 `webpack` 原始配置的上层抽象，使其可以定义具名的 `loader` 规则和具名插件，并有机会在后期进入这些规则并对它们的选项进行修改。

**它允许我们更细粒度的控制其内部配置**

官方代码示例：

```javascript
config
  .plugin(name)
  .use(WebpackPlugin, args)
```

参数说明：

- name 是 `webpack-chain` 里的key，就是要加入的插件在 `webpack-chain` 配置里的 `key` ，就是我们自定义插件的名字
- WebpackPlugin 使用的 `webpack` 插件名，在这里，可以直接使用插件，无需进行实例化，就是不需要 `new WebpackPlugin()`
- args 插件的参数信息。特别注意，**`args`是一个数组**，例如 `[{},{}]` 这种方式，可以配置多个插件实例

**使用示例：**

使用 `webpack-aliyun-oss` 插件实现：项目在测试环境打包的时候自动上传 `aliyun` ，这里可以写在 `configureWebpack ` 也可以写在 `chainWebpack` 里面

```javascript
'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

// 自动上传aliyun
const WebpackAliyunOss = require('webpack-aliyun-oss')
const Oss = require('./oss')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function getPlugins() {
  let plugins = []
  if (process.env.VUE_APP_ENV === 'test') {
    plugins.push(
      new WebpackAliyunOss({
        from: './party_dist/**',
        dist: '/web/party-manage/',
        region: Oss.region,
        accessKeyId: Oss.accessKeyId,
        accessKeySecret: Oss.accessKeySecret,
        bucket: Oss.bucket,
        // test: true,
        setOssPath: filePath => {
          // some operations to filePath
          const index = filePath.lastIndexOf('party_dist')
          const Path = filePath.substring(index + 10, filePath.length)
          return Path.replace(/\\/g, '/')
        },
        setHeaders: filePath => {
          return {
            'Cache-Control': 'max-age=31536000'
          }
        }
      })
    )
  }
  if (process.env.VUE_APP_ENV === 'production') {
    plugins.push(
      new UglifyJsPlugin({ // 生产环境移除console及注释
        uglifyOptions: {
          output: {
            comments: false // 去除注释
          },
          compress: {
            // warnings: false,
            drop_debugger: true,
            drop_console: true, // console
            pure_funcs: ['console.log'] // 移除console
          },
        },
        sourceMap: false,
        parallel: true,
      })
    )
  }
  return plugins
}
function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

module.exports = {
  publicPath: '/',
  outputDir: 'party_dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'xxxxxx',
        changeOrigin: true,
        pathRewrite: {
          // 路径重写
          '^/api': ''
        }
      }
    },
    before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // plugins: getPlugins()
  },
  chainWebpack(config) {
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    config.plugins.delete('prefetch')

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial'
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, 
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ 
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
    if (process.env.VUE_APP_ENV === 'test') {
      config.plugin('WebpackAliyunOss')
        .use('webpack-aliyun-oss', [{
          from: './dist/**',
          dist: '/web/dist/',
          region: Oss.region,
          accessKeyId: Oss.accessKeyId,
          accessKeySecret: Oss.accessKeySecret,
          bucket: Oss.bucket,
          // test: true,
          setOssPath: filePath => {
            // some operations to filePath
            const index = filePath.lastIndexOf('dist')
            const Path = filePath.substring(index + 4, filePath.length)
            return Path.replace(/\\/g, '/')
          },
          setHeaders: filePath => {
            return {
              'Cache-Control': 'max-age=31536000'
            }
          }
        }]
        )
    }
  }
}

```

## 总结：

`configureWebpack` 与 `chainWebpack` 本质上没有什么区别，只是前者配置 **简单方便**，后者可以 **更为细粒度地控制配置**

