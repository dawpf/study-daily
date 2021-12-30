# JSBridge

## 一、什么是JSBridge

主要是给 `JavaScript` 提供调用 Native 功能的接口，让混合开发中的前端部分可以方便地使用 `Native` 的功能（例如：地址位置、摄像头）。
而且 `JSBridge` 的功能不止调用 `Native` 功能这么简单宽泛。实际上，`JSBridge` 就像其名称中的 `Bridge` 的意义一样，是 `Native` 和非 `Native` 之间的桥梁，它的核心是构建 `Native` 和非 `Native` 间消息通信的通道，而且这个通信的通道是双向的。

双向通信的通道:

`JS` 向 `Native` 发送消息: 调用相关功能、通知 `Native` 当前 `JS` 的相关状态等。
`Native` 向 `JS` 发送消息: 回溯调用结果、消息推送、通知 `JS` 当前 `Native` 的状态等。

## 二、JSBridge的使用

1. 首先，需要在项目中注册 `JSBridge`

   ```javascript
   function setupWebViewJavascriptBridge(callback) {
     if (window.WebViewJavascriptBridge) {
       callback(WebViewJavascriptBridge)
     } else {
       document.addEventListener(
         'WebViewJavascriptBridgeReady',
         function () {
           callback(WebViewJavascriptBridge)
         },
         false
       )
     }
   
     if (window.WVJBCallbacks) {
       return window.WVJBCallbacks.push(callback)
     }
     window.WVJBCallbacks = [callback]
     var WVJBIframe = document.createElement('iframe')
     WVJBIframe.style.display = 'none'
     WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
     document.documentElement.appendChild(WVJBIframe)
     setTimeout(function () {
       document.documentElement.removeChild(WVJBIframe)
     }, 0)
   }
   
   // 初始化JSBridge
   initJavascriptBridge() {
   
       setupWebViewJavascriptBridge(function (bridge) {
   
         bridge.init();
   
         // 注册终端主动调用js的方法
         bridge.registerHandler("phoneCallJsDDSProgress", (val) => {
           const data = JSON.parse(val)
           alert(data)
       })
   }
   
   initJavascriptBridge()
   ```

   注：注册 `JSBridge` 的过程是固定的，其中 `phoneCallJsDDSProgress` 是 `web` 端与终端约定好的，终端调用 `web` 端的方法，即：终端可以通过 `phoneCallJsDDSProgress` 这个方法主动向 `web` 端传输数据或执行事件，若有多个方法需要注册，则依次往下注册即可

2. `web` 端调用终端的方法

   ```javascript
   const data = JSON.stringify({ id: 123, name: 'zs' }) // js调用原生方法需要传的参数
   
   // 注册js主动调用终端，获取用户信息的方法
   window.WebViewJavascriptBridge.callHandler('jsCallPhoneUserInfo', data, (val)=>{
       alert('js调用原生方法的回调数据'+val)
   })
   ```

至此，`JSBridge` 使用开发完成