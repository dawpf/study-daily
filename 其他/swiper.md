# swiper （兼容 `IE` ） 

兼容 `IE` 版本 `API` 地址：[2.*版本api地址](https://2.swiper.com.cn/)

## 1 文件引入

包括 `css` 文件、`js` 文件

```html
<head>
  <link rel="stylesheet" href="css/idangerous.swiper.css">
  <script src="js/idangerous.swiper-2.x.min.js"></script>
</head>
```

## 2 使用

html 内容

```html
<div class="swiper-container">
  <div class="swiper-wrapper">
      <div class="swiper-slide"> Slide1</div>
      <div class="swiper-slide"> Slide2</div>
      <div class="swiper-slide"> Slide3</div>
  </div>
  <div class="swiper-pagination"></div>
</div>
```

js 内容

```html
<script type="text/javascript">
window.onload = function() {
  var mySwiper = new Swiper('.swiper-container',{
    loop: true
    //其他设置
  });  
}
</script>
```

由于IE7不支持 `querySelectorAll` 和 `querySelector` 方法，因此 `IE7` 必须要引入 `Jquery`

```html
<script type="text/javascript">
$(function(){
  var mySwiper = $('.swiper-container').swiper({
    loop: true
    //其他设置
  });
})
</script>
```

标签说明

- **Swiper**：整个滑动对象
- **swiper-container：** `Swiper` 的容器，里面包括滑动块 `(slide)`的集合 `(wrapper)`、分页器 `(pagination)`、前进按钮等
- **swiper-wrapper：**触控的对象，可触摸区域，移动的块的集合（轮播内容的容器）
- **swiper-slide：**切换的块中的一个，可以是一段文字、一张图片或者一段html代码（轮播内容item）
- **swiper-pagination：**分页符

## 3 实现上下滑动轮播

html 内容：

```html
<div class="container">
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <img class="swiper_img" src="../img/swiper_img_1.png" alt="">
            </div>
            <div class="swiper-slide">
                <img class="swiper_img" src="../img/swiper_img_2.png" alt="">
            </div>
            <div class="swiper-slide">
                <img class="swiper_img" src="../img/swiper_img_3.png" alt="">
            </div>
            <div class="swiper-slide">
                <img class="swiper_img" src="../img/swiper_img_4.png" alt="">
            </div>
        </div>

        <div class="pagination"></div>
    </div>
</div>
```

js 内容：

```javascript
window.onload = function () {
    var mySwiper = new Swiper('.swiper-container', {
        loop: false, // 是否循环播放
        mode: 'vertical', // 滑动方向，可设置水平(horizontal)或垂直(vertical)。
        mousewheelControl: true, // 是否开启鼠标控制Swiper切换。
        pagination: '.pagination', // 定义一个Swiper的分页器。默认会在这个分页器里面生成与slide对应的span标签
        paginationClickable: true, // 值为true时，点击分页器的指示点时会发生Swiper。
    });
}
```

css 内容：

```css
.swiper-container {
  width: 100%;
  height: 100%;
}

.swiper-wrapper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.swiper_img {
  height: 58.9%;
}

.pagination {
  position: absolute;
  left: 40px;
  top: 0;
  z-index: 20;
  width: 10px;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

.swiper-pagination-switch {
  display: block;
  margin-top: 8px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: #a9a9a9;
  cursor: pointer;
  transition: 0.3s;
}

.swiper-active-switch {
  width: 10px;
  height: 21px;
  border-radius: 5px;
  background: #8a81fa;
}
```

**至此：**一个竖直方向上的兼容 `IE` 的轮播图 完成