# webpack对js进行压缩处理

目前针对webpack配置有两个插件可以选择

- uglifyjs-webpack-plugin
- terser-webpack-plugin

## 1 uglifyjs-webpack-plugin

使用

```markdown
npm install uglifyjs-webpack-plugin --save-dev
```

webpack配置

```javascript
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
					drop_console: true,
				}
			}
		}),
	],
```

## 2 terser-webpack-plugin

使用

```markdown
npm install terser-webpack-plugin --save-dev
```

webpack配置

```javascript
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
    
		// 上线压缩 去除console等信息
		new TerserWebpackPlugin({
			parallel: true,
			extractComments: true,
			terserOptions: {
				ecma: undefined,
				warnings: false,
				parse: {},
				compress: {
					drop_console: true,
					drop_debugger: false,
					pure_funcs: ['console.log'] // 移除console
				}
			},
		})

	],
```

## 注意

- `uglifyjs-webpack-plugin` 不支持es6语法，可以使用 `terser-webpack-plugin` 进行替代

- 若正确配置之后，仍然不能正确去除console，请检查是否添加了下面配置项，导致代码被转成了字符串，注释无法剔除

  ```
  devtool: 'cheap-module-eval-source-map'
  ```

