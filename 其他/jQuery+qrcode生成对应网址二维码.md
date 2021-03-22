# 生成网址对应二维码

## 1 使用外部方法库 qrcode

**说明**： qrcode 其实是通过使用 jQuery 实现图形渲染，画图，支持canvas（HTML5）和table两种方式

**参数配置**：

```markdownm
render   : "canvas",//设置渲染方式  
width       : 256,     //设置宽度  
height      : 256,     //设置高度  
typeNumber  : -1,      //计算模式  
correctLevel    : QRErrorCorrectLevel.H,//纠错等级  
background      : "#ffffff",//背景颜色  
foreground      : "#000000" //前景颜色
```

## 2 使用

index.html **页面代码**

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>web2app</title>
</head>

<style>
  #qrcode {
    width: 100px;
    height: 100px;
    margin-top: 100px;
  }
</style>

<body>
  <button id="btn">按钮</button>

  <div id="qrcode"></div>
</body>

<!-- 引入cdn库生成二维码 -->
<script src="https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js"></script>

<script>
  const $btn = document.querySelector('#btn')
  const goods_id = 111

  $btn.addEventListener('click', function () {
    let href = window.location
    console.log(href);

    jQuery('#qrcode').qrcode(
      {
        width: 100,
        height: 100,
        text: 'https://www.baidu.com'
      }
    );
      
     
	// 点击分享页面，唤醒对应 app  其中 toDetail 为 app 代码协定好的方法
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      //IOS
      try {
        //给你传值进行详情页
        // window.webkit.messageHandlers.toDetail.postMessage({ body: '"' + goods_id + '"' });
        console.log('机型为iPhone|iPad|iPod|iOS');

      } catch (e) {
        //浏览器
        window.location.href = "goods.php?id=" + goods_id;
      }
    } else if (/(Android)/i.test(navigator.userAgent)) {
      //Android
      try {
        // window.jkslw.toDetail(goods_id);
        console.log('机型为安卓');
      } catch (e) {
        //alert(e);//自己浏览器访问
        window.location.href = "goods.php?id=" + goods_id;
      }
    } else {
      console.log('机型为其他');
      // window.location.href = "goods.php?id=" + goods_id;
    }
  })

</script>

</html>
```

