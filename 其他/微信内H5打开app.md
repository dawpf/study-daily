# 微信内H5打开app

## 一、准备条件

微信内访问网页时跳转到 APP的准备条件：

1. 服务号已认证：[微信公众平台](https://mp.weixin.qq.com/) 注册一个【服务号】并微信认证
2. 开放平台账号已认证：[微信开放平台](https://open.weixin.qq.com/) 注册一个账号，并完成开发者资质认证
3. 服务号与开放平台账号同主体：【服务号】和【开放平台账号】认证主体一致！

## 二、相关文档

官方文档很详细

1. [功能介绍、使用说明、前期准备](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/WeChat_H5_Launch_APP.html)
2. [微信开放标签说明文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_Open_Tag.html)
3. [App获取开放标签中的extinfo数据](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/APP_GET_EXTINF.html)

## 三、重要设置

- [微信公众平台](https://mp.weixin.qq.com/) 设置IP白名单，该IP地址获取access_token

  ```
  开发->基本配置->公众号开发信息->IP白名单
  ```

- [微信公众平台](https://mp.weixin.qq.com/) 绑定安全域名

  ```
  设置->公众号设置->功能设置->JS接口安全域名
  ```

- [微信开放平台](https://open.weixin.qq.com/) 绑定所需要跳转的App，这里也需要设置安全域名

  ```
  管理中心 -> 公众帐号 -> 接口信息 -> 网页跳转移动应用 -> 关联设置中绑定所需要跳转的App
  ```

## 四、几个重要参数！！

- 开发者ID(AppID) 来自 [微信公众平台](https://mp.weixin.qq.com/)
- 开发者密码(AppSecret) 来自 [微信公众平台](https://mp.weixin.qq.com/)
- 移动应用Appid 来自 [微信开放平台](https://open.weixin.qq.com/)

## 五、使用示例

### 页面首先引入js文件

```html
<script src="http://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
```

### wx配置：

```javascript
wx.config({
  debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
  appId: '<开发者ID(AppID)>', // 必填，公众号的唯一标识
  timestamp: '', // 必填，生成签名的时间戳
  nonceStr: '', // 必填，生成签名的随机串
  signature: '',// 必填，签名
  jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表
  openTagList: ['wx-open-launch-app'] // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
});
```

### 页面标签使用：

```html
<wx-open-launch-app
  id="launch-btn"
  appid="<移动应用Appid>"
  extinfo="your-extinfo"
>
  <template>
    <style>.btn { padding: 12px }</style>
    <button class="btn">App内查看</button>
  </template>
</wx-open-launch-app>
```

### 注册点击事件：

```javascript
var launchBtn = document.getElementById('launch-btn');
if (launchBtn) {
	launchBtn.addEventListener('launch', function (e) {
        // 尝试进行唤起 操作成功执行的函数
     })
	launchBtn.addEventListener('error', function (e) {
		// 尝试进行唤起 操作失败执行的函数	，可选择跳转 AppStore 或者下载引导页等
	})
}
```

### 样式设置：

- wx-open-launch-app标签外部样式和内部样式是隔离的
- wx-open-launch-app这个标签可以加样式style

```html
<div style="background-color:red">
   <wx-open-launch-app id="launch-btn" appid="appid">
		<template>
			<div class="wx-btn" style="height: 30px;font-size: 13px;color: #b16a26;">
				打开 APP
			</div>
		</template>
	</wx-open-launch-app> 
</div>
```

### wx.config 参数说明：

- `debug: true`  ：开启调试模式，调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印

  若在调试过程中弹出 `errMsg:config:ok` 证明配置文件已完成，此时需要关闭 debug 位为 false，进行后续打开 app 的操作

- `appId： <开发者ID(AppID)>`：必填，公众号的唯一标识

- `timestamp: ''`：必填，生成签名的时间戳（秒）

- `nonceStr: ''`： 必填，生成签名的随机串

- `signature:''`：必填，签名（获取签名步骤见附录）

- `jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']`： 必填，需要使用的JS接口列表（所有的 js 接口列表见附录）

- `openTagList: ['wx-open-launch-app']`：可选，需要使用的开放标签列表，例如['wx-open-launch-app']，（所有的开放标签列表见附录）

### **附录：**

[官方文档地址](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#7)

#### 获取签名

[官方文档地址：底部附录1](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#7)

生成签名之前必须先了解一下 `jsapi_ticket`，`jsapi_ticket` 是公众号用于调用微信JS接口的临时票据。正常情况下，`jsapi_ticket` 的有效期为7200秒，通过 `access_token` 来获取。由于获取 `jsapi_ticket` 的api调用次数非常有限，频繁刷新 `jsapi_ticket` 会导致api调用受限，影响自身业务，开发者必须在自己的服务全局缓存 `jsapi_ticket` 。

1. 参考以下文档获取 `access_token`（有效期7200秒，开发者必须在自己的服务全局缓存 `access_token`）：

   https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html

   注：获取 `access_token` 所需要的参数

   - `appid` ：[微信公众平台](https://mp.weixin.qq.com/) -> 开发 -> 基本配置 -> 公众号开发信息
   - `secret`：[微信公众平台](https://mp.weixin.qq.com/) -> 开发 -> 基本配置 -> 公众号开发信息

2. 用第一步拿到的 `access_token` 采用http GET方式请求获得 `jsapi_ticket`（有效期7200秒，开发者必须在自己的服务全局缓存 `jsapi_ticket`）：

   https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi

成功返回如下JSON：

```json
{
  "errcode":0,
  "errmsg":"ok",
  "ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
  "expires_in":7200
}
```

获得 `jsapi_ticket` 之后，就可以生成JS-SDK权限验证的签名了。

**签名算法**

签名生成规则如下：参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分） 。对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。

即signature=sha1(string1)。 示例：

```text
noncestr=Wm3WZYTPz0wzccnW
jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg
timestamp=1414587457
url=http://mp.weixin.qq.com?params=value
```

步骤1. 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1：

```text
jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg&noncestr=Wm3WZYTPz0wzccnW&timestamp=1414587457&url=http://mp.weixin.qq.com?params=value
```

步骤2. 对string1进行sha1签名，得到signature：

```text
0f9de62fce790f9a083d5c99e95740ceb90c27ed
```

**sha1 签名（JavaScript）**

```javascript
function encodeUTF8(s) {
    var i, r = [], c, x;
    for (i = 0; i < s.length; i++)
      if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
      else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
      else {
        if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
          c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
            r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
        else r.push(0xE0 + (c >> 12 & 0xF));
        r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
      };
    return r;
}

// 字符串加密成 hex 字符串
function sha1(s) {
    var data = new Uint8Array(encodeUTF8(s))
    var i, j, t;
    var l = ((data.length + 8) >>> 6 << 4) + 16, s = new Uint8Array(l << 2);
    s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
    for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2);
    s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
    s[l - 1] = data.length << 3;
    var w = [], f = [
      function () { return m[1] & m[2] | ~m[1] & m[3]; },
      function () { return m[1] ^ m[2] ^ m[3]; },
      function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
      function () { return m[1] ^ m[2] ^ m[3]; }
    ], rol = function (n, c) { return n << c | n >>> (32 - c); },
      k = [1518500249, 1859775393, -1894007588, -899497514],
      m = [1732584193, -271733879, null, null, -1009589776];
    m[2] = ~m[0], m[3] = ~m[1];
    for (i = 0; i < s.length; i += 16) {
      var o = m.slice(0);
      for (j = 0; j < 80; j++)
        w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
          t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
          m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
      for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0;
    };
    t = new DataView(new Uint32Array(m).buffer);
    for (var i = 0; i < 5; i++)m[i] = t.getUint32(i << 2);

    var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
      return (e < 16 ? "0" : "") + e.toString(16);
    }).join("");
    
    return hex;
}
```

**至此，我们就获取到了签名**，我们可以对签名进行校验：[微信 JS 接口签名校验工具](http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign)

#### js 接口列表

[官方文档地址：底部附录2](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#7)

#### 开放标签列表

- <wx-open-launch-weapp>
- <wx-open-launch-app>
- <wx-open-subscribe>
- <wx-open-audio>

## 六、常见问题

[常见问题：底部附录5](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#7)

**另：**

- config:ok 之后，需要关闭debug
- config 注入阶段出错的话，标签不会显示出来

