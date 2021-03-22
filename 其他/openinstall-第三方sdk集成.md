## openinstall

### 简介：

openinstall 其实就是个第三方，是Android/iOS sdk集成，存放Android/iOS软件安装包。用以替代手工多渠道打包的方式

### 使用方法

- [ ] 打开 [opinstall 官网](https://www.openinstall.io/)，注册并登录
- [ ] 添加应用 - 配置应用基本信息 - 应用集成（按步骤）

前端：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no,viewport-fit=cover">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>openinstall</title>
</head>

<body>
  <div>
    <button onclick="downloadApp()">点击下载应用</button>
  </div>
</body>

// 引入js文件
<script src="//res.cdn.openinstall.io/openinstall.js"></script>
<script>

  let data = OpenInstall.parseUrlParams()
  let openInstall;
  new OpenInstall({
    appKey: "你的应用的 AppKey ",      // 这里的AppKey来自于openinstall
    preferWakeup: false,   // 唤醒
    onready: function () {
      openInstall = this
      openInstall.schemeWakeup()
    }
  }, data)

  function downloadApp() {
    openInstall.wakeupOrInstall();
  }

</script>

</html>
```

打来页面，点击按钮，页面就会自动执行openinstall方法，自动判断当前设备并进行相应跳转

注：

- [ ] app 未集成会提示平台的集成工作未完成
- [ ] js文件为 cdn 引入，需要在服务器中正常运行(本地服务器也可以)

附：本地服务器搭建方法

```javascript
npm install serve -g
```

终端或者控制台

```javascript
serve "项目文件夹"    // 或进入项目文件夹 - 运行命令 serve 

// 项目文件夹中有 index.html 会直接打开网页，没有的话会在服务器中打开文件夹，点击打开相应文件
```