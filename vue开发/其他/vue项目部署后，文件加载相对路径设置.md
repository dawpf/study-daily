vue项目部署后，文件加载相对路径设置

vue项目打包放在oss服务器上，有时会因为oss上项目文件夹没有存在于配置的域名根目录下，就可能引起项目文件css、js等出现加载失败的情况

例如：oss配置域名 ` https://web.aaaa.com/` ，项目文件夹目录为 `ost/web/H5/` ，这样我们在加载项目文件夹目录下 `index.html` 时，就可能会出现css、js文件加载失败，因为我们如果设置了绝对路径，项目就会从域名根目录下找资源

**vue.config.js 文件修改项目配置文件**

`publicPath: "./"`

```javascript
// vue.config.js

module.exports = {
  assetsDir: 'static',
  publicPath: "./", // 文件加载设置为相对路径
  outputDir: "dist",
  lintOnSave: false, // 关闭eslint
  productionSourceMap: true, // 生产环境下css 分离文件
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    }
  },
};

```

