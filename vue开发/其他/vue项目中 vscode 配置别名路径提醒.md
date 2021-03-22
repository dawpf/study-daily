# vue项目中 vscode 配置别名路径提醒

**实现效果：**

vue项目中，输入路径 "@/" 自动提示后续路径

**修改项目默认配置**

```javascript
// vue.config.js

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  lintOnSave: false, // 关闭eslint
  productionSourceMap: true, // 生产环境下css 分离文件
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      }
    }
  },
};
```

**项目根目录添加文件**

```json
// jsconfig.json

{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
        "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

这样，我们在输入文件路径的时候 `"@/"` 后续路径就会智能提示了。