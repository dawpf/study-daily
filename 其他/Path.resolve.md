# Path.resolve()

[**resolve 将路径或路径片段的序列解析为绝对路径**](https://links.jianshu.com/go?to=http%3A%2F%2Fnodejs.cn%2Fapi%2Fpath.html%23path_path_resolve_paths)

### resolve的定义

1. 对于给定的路径片段，是 `从右向左` 拼接处理，直至构造出绝对路径;
2. 如果在处理完所有给定的 path 片段之后还未生成绝对路径，则需要加上当前工作目录。

### demo示例

```javascript
var path = require("path")     //引入node的path模块

path.resolve('/foo/bar', './baz')   // returns '/foo/bar/baz'
path.resolve('/foo/bar', 'baz')   // returns '/foo/bar/baz'
path.resolve('/foo/bar', '/baz')   // returns '/baz'
path.resolve('/foo/bar', '../baz')   // returns '/foo/baz'
path.resolve('home','/foo/bar', '../baz')   // returns '/foo/baz'
path.resolve('home','./foo/bar', '../baz')   // returns '当前工作目录/home/foo/baz'
path.resolve('home','foo/bar', '../baz')   // returns '当前工作目录/home/foo/baz'
```

### 便于理解

上面的操作，其实相当于`命令行中的 cd操作`，举例如下：

```javascript
path.resolve('/foo/bar', '../baz')   // returns '/foo/baz'
```

相当于

```bash
cd /foo/bar
cd ..
cd baz
```