### 使用插件进行项目分析

```javascript
yarn add webpack-bundle-analyzer -D
```

vue.config.js 配置

```javascript
// 引入 webpack-bundle-analyzer 并对其进行初始化配置，可默认配置
const BundleAnalyzerPlugin = new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
  //  可以是`server`，`static`或`disabled`。
  //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
  //  在“静态”模式下，会生成带有报告的单个HTML文件。
  //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
  analyzerMode: 'server',
  //  将在“服务器”模式下使用的主机启动HTTP服务器。
  analyzerHost: '127.0.0.1',
  //  将在“服务器”模式下使用的端口启动HTTP服务器，默认8888接口。
  analyzerPort: 3333,
  //  路径捆绑，将在`static`模式下生成的报告文件。
  //  相对于捆绑输出目录。
  reportFilename: 'report.html',
  //  模块大小默认显示在报告中。
  //  应该是`stat`，`parsed`或者`gzip`中的一个。
  //  有关更多信息，请参见“定义”一节。
  defaultSizes: 'parsed',
  //  在默认浏览器中自动打开报告
  openAnalyzer: true,
  //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
  generateStatsFile: false,
  //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
  //  相对于捆绑输出目录。
  statsFilename: 'stats.json',
  //  stats.toJson（）方法的选项。
  //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
  //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
  statsOptions: null,
  logLevel: 'info' // 日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
})

module.exports = {
    chainWebpack: config => {
    config.plugins.delete('prefetch')
    config
      .plugin('webpack-bundle-analyzer')
      .use(BundleAnalyzerPlugin)
  }
}
```

运行命令 **npm run serve**，就可以在 http://localhost:2222 (默认8888端口)，对项目进行分析查看

