# js：判断页面在 微信 / 微博 / QQ / 支付宝 内置浏览器内打开

```javascript
const u = navigator.userAgent.toLowerCase()
let isApp =
  u.match(/MicroMessenger/i) == "micromessenger" ||
  u.match(/WeiBo/i) == "weibo" ||
  u.match(/QQ/i) == "qq" ||
  /alipay/ig.test(u)
```

通过以上代码，就可以使用js判断，当前页面是否在 微信 / 微博 / QQ / 支付宝 内打开

令：再附上browser的代码，通过以下方法可以判断很多浏览器。**包括判断IE浏览器，Opera浏览器，苹果浏览器，谷歌浏览器，火狐浏览器等。**

```javascript
const browser = {
  versions: function () {
    var u = navigator.userAgent, app = navigator.appVersion;
    return {         //移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
```

