# aliyun

使用阿里云，工程化管理打包文件，文件打包的同时，发布到的阿里云服务器上

安装依赖

```javascript
npm i webpack-aliyun-oss -S
```

配置依赖，根目录下新建

```javascript
// oss.js

module.exports = {
  region: 'your region',
  accessKeyId: 'your accessKeyId',
  accessKeySecret: 'your accessKeySecret',
  bucket: 'your bucket'
}
```

环境配置

```javascript
// vue.config.js

const WebpackAliyunOss = require('webpack-aliyun-oss')
const Oss = require('./oss')

const IS_TEST = process.env.ENV === 'test'

module.exports = {
  ...,
  configureWebpack: config => {
    // config.externals = {
    //   'vue': 'Vue',
    //   'vue-router': 'VueRouter',
    //   'axios': 'axios',
    //   'agora-rtc-sdk': 'AgoraRTC'
    // }
    if (IS_TEST) {
      const webpackAliyunOss = [
        // eslint-disable-next-line no-undef
        new WebpackAliyunOss({
          from: './dist_dev/**', // 打包生成的文件
          dist: '/ost/web/web_dev/', // 服务器的目录
          region: Oss.region,
          accessKeyId: Oss.accessKeyId,
          accessKeySecret: Oss.accessKeySecret,
          bucket: Oss.bucket,
          // test: true,
          setOssPath: filePath => {
            // some operations to filePath
            const index = filePath.lastIndexOf('dist_dev')
            const Path = filePath.substring(index + 15, filePath.length)
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
      config.plugins = [...config.plugins, ...webpackAliyunOss]
    }
  },
  ...
}
```

配置命令

```javascript
"scripts": {
    ...,
    "build:test": "vue-cli-service build --mode test",
    ...
}

```

这样，我们在使用命令 `npm run build:test` 时，就可以同步上传到 `aliyun` 服务器上

