# canvas

## 简介

 `<canvas>` 是 `HTML5` 新增的，一个可以使用脚本(通常为 `JavaScript` )在其中绘制图像的 `HTML` 元素。它可以用来制作照片集或者制作简单(也不是那么简单)的动画，甚至可以进行实时视频处理和渲染。

 它最初由苹果内部使用自己 `MacOS X WebKit` 推出，供应用程序使用像仪表盘的构件和 `Safari` 浏览器使用。 后来，有人通过 `Gecko` 内核的浏览器 (尤其是 `Mozilla` 和 `Firefox` )，`Opera `和 `Chrome` 和超文本网络应用技术工作组建议为下一代的网络技术使用该元素。

 `Canvas `是由 `HTML `代码配合高度和宽度属性而定义出的可绘制区域。`JavaScript `代码可以访问该区域，类似于其他通用的二维`API`，通过一套完整的绘图函数来动态生成图形。

 Mozilla 程序从 Gecko 1.8 (Firefox 1.5)开始支持 `<canvas>`, Internet Explorer 从IE9开始 `<canvas>` 。Chrome和Opera 9+ 也支持 `<canvas>`。

## 兼容性

**canvas 标签**

```html
<canvas id="canvas" width="300px" height="300px"></canvas>
```

`<canvas>` 看起来和 `<img>` 标签一样，只是 `<canvas>` 只有两个可选的属性 `width、heigth` 属性，而没有 `src、alt` 属性。

 如果不给 `<canvas>` 设置 `widht、height` 属性时，则默认 `width`为300、`height` 为150,单位都是 `px`。也可以使用 `css` 属性来设置宽高，但是如宽高属性和初始比例不一致，他会出现扭曲。所以，建议永远不要使用 `css `属性来设置 `<canvas>` 的宽高。

**兼容性及替换内容**

 由于某些较老的浏览器（尤其是IE9之前的IE浏览器）或者浏览器不支持HTML元素`<canvas>`，在这些浏览器上你应该总是能展示替代内容。

 支持 `<canvas>` 的浏览器会只渲染 `<canvas>` 标签，而忽略其中的替代内容。不支持 `<canvas>` 的浏览器则 会直接渲染替代内容。

```html
<canvas> 你的浏览器不支持canvas,请升级你的浏览器 </canvas>
```

`js` 判断是否兼容

```javascript
const canvas = document.querySelector('#canvas')
if (!canvas.getContext) return;
```

## 使用

`<canvas> ` 会创建一个固定大小的画布，会公开一个或多个 **渲染上下文** (画笔)，使用 **渲染上下文 **来绘制和处理要展示的内容。

`canvas` 获取绘画上下文的 `api` 是 `getContext("2d")`。`api` 介绍还有这句话

```markdown
提示：在未来，如果 canvas 标签扩展到支持 3D 绘图，getContext() 方法可能允许传递一个 "3d" 字符串参数。
```

可能是因为越来越多浏览器都已经支持 `webGL` 的原因把，这个 `getContext("3d") ` 有可能再也不会来了.

`webGL` 就是浏览器端的 3D 绘图标准，它直接借助系统显卡来渲染 3D 场景，它能制作的 3D 应用，是普通 `canvas` 无法相比的。所以，你有复杂的 3D 前端项目，且不考虑 IE 的兼容性的话。不用说，直接使用 `webGL` 吧。

**代码模板**

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>canvas</title>
</head>

<style>
  #canvas {
    border: 1px solid #000;
  }
</style>

<body>

  <canvas id="canvas" width="300px" height="300px"></canvas>

</body>

<script>
  function draw() {
    const canvas = document.querySelector('#canvas')
    if (!canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    // 开始绘制


  }

  draw()
</script>

</html>
```

### 1 图形绘制

`canvas`  元素默认被网格所覆盖。通常来说网格中的一个单元相当于 `canvas` 元素中的一像素。栅格的起点为左上角（坐标为（0,0））。所有元素的位置都相对于原点来定位。**所以图形坐标（x,y）：左上角的坐标为距离左边（X轴）x像素，距离上边（Y轴）y像素。**

 `<canvas>` 只支持一种原生的 图形绘制：矩形。所有其他图形都至少需要生成一种路径( `path` )。不过，我们拥有众多路径生成的方法让复杂图形的绘制成为了可能。

`canvas` 提供了三种方法绘制矩形：

- 绘制一个填充的矩形

  `fillRect(x, y, width, height)`

- 绘制一个矩形的边框

  `strokeRect(x, y, width, height)`

- 清除指定的矩形区域，这块区域会完全透明

  `clearRect(x, y, width, height)`

 **参数说明：**

 `x, y`：指的是矩形的左上角的坐标。(相对于 `canvas` 的坐标原点)

 `width, height`：指的是绘制的矩形的宽和高。

**例如：**绘制两个矩形

```javascript
function draw() {
    const canvas = document.querySelector('#canvas')
    if (!canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    // 开始绘制

    ctx.fillRect(10, 10, 100, 50);  // 绘制矩形,填充的默认颜色为黑色
    ctx.strokeRect(10, 70, 100, 50);  // 绘制矩形边框
    ctx.clearRect(15, 15, 50, 25); // 清除矩形里面的某一区域
    
}
```

### 2 路径绘制

#### 1 绘制直线

 图形的基本元素是路径。

 路径是通过不同颜色和宽度的线段或曲线相连形成的不同形状的点的集合。

 一个路径，甚至一个子路径，都是闭合的。

**使用路径绘制图形的步骤：**

1. 创建路径起始点
2. 调用绘制方法去绘制出路径
3. 把路径封闭
4. 路径生成，通过描边或填充路径区域来渲染图形。

**需要用到的方法：**

- 新建一条路径，路径创建成功之后，图形绘制命令会被指向到路径上开始生成路径

  `beginPath()`

- 把画笔移动到指定的坐标 `(x, y)`。相当于设置路径的起始点坐标。

  `moveTo(x, y)`

- 绘制一条从当前位置到指定坐标 `(x, y)` 的直线

  `lineTo(x, y)`

- 闭合路径。会拉一条从当前点到起始点的直线。如果当前点与起始点重合，则什么都不做

  `closePath()`

- 通过线条来绘制图形轮廓

  `stroke()`

- 通过填充路径的内容区域生成实心的图形

  `fill()`

**例如：**绘制一个三角形并进行填充

```javascript
function draw() {
    const canvas = document.querySelector('#canvas')
    if (!canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    // 开始绘制
    
    ctx.beginPath(); // 新建路径
    ctx.moveTo(50, 50); // 画笔移动到指定坐标
    ctx.lineTo(200, 50); // 绘制一条从当前位置到指定坐标(200, 50)的直线
    ctx.lineTo(200, 200);
	ctx.closePath(); // 闭合路径
    ctx.fill(); // 填充闭合区域。如果path没有闭合，则fill()会自动闭合路径。

}
```

#### 2 绘制圆弧

有两个方法可以绘制圆弧：

- `arc(x, y, r, startAngle, endAngle, anticlockwise)`

  以 `(x, y)` 为圆心，以 `r` 为半径，从 `startAngle` 弧度开始到 `endAngle` 弧度结束。`anticlosewise `是布尔值，`true ` 表示逆时针，`false` 表示顺时针。(默认是顺时针)

  **注意：**

  1. 这里的度数都是弧度。
  2. `0` 弧度是指的 `x` 轴正方形

  ```javascript
  radians=(Math.PI/180)*degrees   //角度转换成弧度
  ```

- `arcTo(x1, y1, x2, y2, radius)`:

  根据给定的控制点和半径画一段圆弧，最后再以直线连接两个控制点。

**例如：**绘制圆弧

```javascript
function draw() {
    const canvas = document.querySelector('#canvas')
    if (!canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    // 开始绘制
    ctx.beginPath();
    ctx.arc(50, 50, 40, 0, Math.PI / 2, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(150, 50, 40, 0, -Math.PI / 2, true);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(50, 150, 40, -Math.PI / 2, Math.PI / 2, false);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(150, 150, 40, 0, Math.PI, false);
    ctx.fill();

}

draw()
```

### 3 添加样式和颜色

#### 1 绘制颜色

  如果想要给图形上色，有两个重要的属性可以做到。

1. 设置图形的填充颜色

   `fillStyle = color`

2. 设置图形轮廓的颜色

   `strokeStyle = color`

**注意：**

1. `color` 可以是表示 `css` 颜色值的字符串、渐变对象或者图案对象。
2. 默认情况下，线条和填充颜色都是黑色。
3. 一旦您设置了 `strokeStyle` 或者 `fillStyle` 的值，那么这个新值就会成为新绘制的图形的默认值。如果你要给每个图形上不同的颜色，你需要重新设置 `fillStyle` 或 `strokeStyle` 的值。

**例如：**绘制颜色

```javascript
function draw() {
    var canvas = document.getElementById('tutorial');
    if (!canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            ctx.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * i) + ',' +
                Math.floor(255 - 42.5 * j) + ',0)';
            ctx.fillRect(j * 50, i * 50, 50, 50);
        }
    }
}
draw();
```

#### 2  绘制样式

- `lineWidth = value`

  线宽。只能是正值。默认是`1.0`。

  起始点和终点的连线为中心，**上下各占线宽的一半**

  ```javascript
  function draw() {
      var canvas = document.getElementById('canvas');
      if (!canvas.getContext) return;
      var ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(100, 10);
      ctx.lineWidth = 10;
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(110, 10);
      ctx.lineTo(160, 10)
      ctx.lineWidth = 20;
      ctx.stroke()
  }
  draw();
  ```

- `lineCap = type`

  线条末端样式。

  共有3个值：

  1. `butt`：线段末端以方形结束
  2. `round`：线段末端以圆形结束
  3. `square`：线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域。

  ```javascript
  function draw() {
      var canvas = document.getElementById('canvas');
      if (!canvas.getContext) return;
      var ctx = canvas.getContext("2d");
      
      var lineCaps = ["butt", "round", "square"];
  
      for (var i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(20 + 30 * i, 30);
          ctx.lineTo(20 + 30 * i, 100);
          ctx.lineWidth = 20;
          ctx.lineCap = lineCaps[i];
          ctx.stroke();
      }
  
      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.lineTo(300, 30);
  
      ctx.moveTo(0, 100);
      ctx.lineTo(300, 100)
  
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.stroke();
  
  }
  draw();
  ```

- `lineJoin = type`

  同一个path内，设定线条与线条间接合处的样式。

  共有3个值`round`, `bevel` 和 `miter`：

  1. `round`

     通过填充一个额外的，圆心在相连部分末端的扇形，绘制拐角的形状。 圆角的半径是线段的宽度。

  2. `bevel`

     在相连部分的末端填充一个额外的以三角形为底的区域， 每个部分都有各自独立的矩形拐角。

  3. `miter`(默认)

     通过延伸相连部分的外边缘，使其相交于一点，形成一个额外的菱形区域。

  ```javascript
  function draw() {
      var canvas = document.getElementById('canvas');
      if (!canvas.getContext) return;
      var ctx = canvas.getContext("2d");
  
      var lineJoin = ['round', 'bevel', 'miter'];
      ctx.lineWidth = 20;
  
      for (var i = 0; i < lineJoin.length; i++) {
          ctx.lineJoin = lineJoin[i];
          ctx.beginPath();
          ctx.moveTo(50, 50 + i * 50);
          ctx.lineTo(100, 100 + i * 50);
          ctx.lineTo(150, 50 + i * 50);
          ctx.lineTo(200, 100 + i * 50);
          ctx.lineTo(250, 50 + i * 50);
          ctx.stroke();
      }
  
  }
  draw();
  ```

- 虚线

  用 `setLineDash` 方法和 `lineDashOffset` 属性来制定虚线样式. `setLineDash` 方法接受一个数组，来指定线段与间隙的交替；`lineDashOffset`属性设置起始偏移量.

  ```javascript
  function draw() {
      var canvas = document.getElementById('canvas');
      if (!canvas.getContext) return;
      var ctx = canvas.getContext("2d");
  
      ctx.setLineDash([20, 5]);  // [实线长度, 间隙长度]
      ctx.lineDashOffset = -0;
      ctx.strokeRect(50, 50, 210, 210);
  
  }
  draw();
  ```

### 4 文本绘制

canvas 提供了两种方法来渲染文本:

1. 在指定的(x,y)位置填充指定的文本，绘制的最大宽度是可选的

   `fillText(text, x, y [, maxWidth])`

2. 在指定的(x,y)位置绘制文本边框，绘制的最大宽度是可选的

   `strokeText(text, x, y [, maxWidth])`

```javascript
function draw() {
    var canvas = document.getElementById('canvas');
    if (!canvas.getContext) return;
    var ctx = canvas.getContext("2d");

    ctx.font = "100px sans-serif"
    ctx.fillText("abc", 10, 100);
    ctx.strokeText("abc", 10, 200)

}
draw();
```

给文本添加样式：

1. `font = value`

   当前我们用来绘制文本的样式。这个字符串使用和 `CSS font`属性相同的语法. 默认的字体是 `10px sans-serif`。

2. `textAlign = value`

   文本对齐选项. 可选的值包括：`start`, `end`, `left`, `right` or `center`. 默认值是 `start`。

3. `textBaseline = value`

   基线对齐选项，可选的值包括：`top`, `hanging`, `middle`, `alphabetic`, `ideographic`, `bottom`。默认值是 `alphabetic。`

4. `direction = value`

   文本方向。可能的值包括：`ltr`, `rtl`, `inherit`。默认值是 `inherit。`

### 5 图片绘制

- 绘制图片 `drawImage(image, x, y, width, height)`

  参数说明：

  要绘制的 image，绘制的img在canvas中的坐标（x，y）， `width` 和 `height，`这两个参数用来控制 当像canvas 画入时应该缩放的大小。

- 切片 `drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)`

   第一个参数和其它的是相同的，都是一个图像或者另一个 canvas 的引用。

  其他8个参数：

   前4个是定义图像源的切片位置和大小，

   后4个则是定义切片的目标显示位置和大小。

### 6 变形

- 平移 `translate(x, y)`

   用来移动 `canvas` 的**原点**到指定的位置

   `translate`方法接受两个参数。`x` 是左右偏移量，`y` 是上下偏移量。

  在做变形之前先保存状态是一个良好的习惯。大多数情况下，调用 `restore` 方法比手动恢复原先的状态要简单得多。又如果你是在一个循环中做位移但没有保存和恢复`canvas` 的状态，很可能到最后会发现怎么有些东西不见了，那是因为它很可能已经超出 `canvas` 范围以外了。

  ```javascript
  function draw() {
      var canvas = document.getElementById('canvas');
      if (!canvas.getContext) return;
      var ctx = canvas.getContext("2d");
  
      ctx.save(); //保存坐原点平移之前的状态
      ctx.translate(100, 100);
      ctx.strokeRect(0, 0, 100, 100)
      ctx.restore(); //恢复到最初状态
      ctx.translate(220, 220);
      ctx.fillRect(0, 0, 100, 100)
  
  }
  draw();
  ```

- 旋转 `rotate(angle)`

   这个方法只接受一个参数：旋转的角度(angle)，它是顺时针方向的，以弧度为单位的值。

   旋转的中心是坐标原点。

  ```javascript
  function draw() {
      var canvas = document.getElementById('canvas');
      if (!canvas.getContext) return;
      var ctx = canvas.getContext("2d");
  
      ctx.fillStyle = "red";
      ctx.save();
  
      ctx.translate(100, 100);
      ctx.rotate(Math.PI / 180 * 45);
      ctx.fillStyle = "blue";
      ctx.fillRect(0, 0, 100, 100);
      ctx.restore();
  
      ctx.save();
      ctx.translate(0, 0);
      ctx.fillRect(0, 0, 50, 50)
      ctx.restore();
  
  }
  draw();
  ```

- 缩放 `scale(x, y)`

   我们用它来增减图形在 `canvas` 中的像素数目，对形状，位图进行缩小或者放大。

   `scale` 方法接受两个参数。`x,y` 分别是横轴和纵轴的缩放因子，它们都必须是正值。值比 1.0 小表示缩 小，比 1.0 大则表示放大，值为 1.0 时什么效果都没有。

   默认情况下，`canvas` 的 1 单位就是 1 个像素。举例说，如果我们设置缩放因子是 0.5，1 个单位就变成对应 0.5 个像素，这样绘制出来的形状就会是原先的一半。同理，设置为 2.0 时，1 个单位就对应变成了 2 像素，绘制的结果就是图形放大了 2 倍。

- 变形矩阵 `transform(a, b, c, d, e, f)`

### 7 合成

在前面的所有例子中、，我们总是将一个图形画在另一个之上，对于其他更多的情况，仅仅这样是远远不够的。比如，对合成的图形来说，绘制顺序会有限制。不过，我们可以利用 `globalCompositeOperation` 属性来改变这种状况。

`globalCompositeOperation = type`

例如：

```javascript
function draw() {
    var canvas = document.getElementById('canvas');
    if (!canvas.getContext) return;
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, 200, 200);

    ctx.globalCompositeOperation = "source-over"; //全局合成操作
    ctx.fillStyle = "red";
    ctx.fillRect(100, 100, 200, 200);

}
draw();
```

`type`是下面 13 种字符串值之一：

- `source-over(default)` 这是默认设置，新图像会覆盖在原有图像。
- `source-in` 仅仅会出现新图像与原来图像重叠的部分，其他区域都变成透明的。(包括其他的老图像区域也会透明)
- `source-out` 仅仅显示新图像与老图像没有重叠的部分，其余部分全部透明。(老图像也不显示)
- `source-atop` 新图像仅仅显示与老图像重叠区域。老图像仍然可以显示
- `destination-over` 新图像会在老图像的下面
- `destination-in` 仅仅新老图像重叠部分的老图像被显示，其他区域全部透明
- `destination-out` 仅仅老图像与新图像没有重叠的部分。 注意显示的是老图像的部分区域
- `destination-atop` 老图像仅仅仅仅显示重叠部分，新图像会显示在老图像的下面
- `lighter` 新老图像都显示，但是重叠区域的颜色做加处理
- `darken` 保留重叠部分最黑的像素。(每个颜色位进行比较，得到最小的)
- `lighten` 保证重叠部分最量的像素。(每个颜色位进行比较，得到最大的)
- `xor` 重叠部分会变成透明
- `copy` 只有新图像会被保留，其余的全部被清除(边透明)

### 8 动画

**基本步骤：**

1. 清空 `canvas`

   再绘制每一帧动画之前，需要清空所有。清空所有最简单的做法就是`clearRect()`方法

2. 保存 `canvas` 状态

   如果在绘制的过程中会更改`canvas`的状态(颜色、移动了坐标原点等),又在绘制每一帧时都是原始状态的话，则最好保存下`canvas`的状态

3. 绘制动画图形

   这一步才是真正的绘制动画帧

4. 恢复 `canvas` 状态

   如果你前面保存了 `canvas` 状态，则应该在绘制完成一帧之后恢复 `canvas` 状态。

**控制动画：**

我们可用通过`canvas`的方法或者自定义的方法把图像会知道到`canvas`上。正常情况，我们能看到绘制的结果是在脚本执行结束之后。例如，我们不可能在一个 `for` 循环内部完成动画。

也就是，为了执行动画，我们需要一些可以定时执行重绘的方法。

一般用到下面三个方法：

1. `setInterval()`
2. `setTimeout()`
3. `requestAnimationFrame()`

**例如：**太阳系

```javascript
let sun;
let earth;
let moon;
let ctx;
function init() {
    sun = new Image();
    earth = new Image();
    moon = new Image();
    sun.src = "./sun.png";
    earth.src = "./earth.png";
    moon.src = "./moon.png";

    let canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");

    sun.onload = function () {
        draw()
    }

}
init();
function draw() {
    ctx.clearRect(0, 0, 300, 300); //清空所有的内容
    /*绘制 太阳*/
    ctx.drawImage(sun, 0, 0, 300, 300);

    ctx.save();
    ctx.translate(150, 150);

    //绘制earth轨道
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,0,0.5)";
    ctx.arc(0, 0, 100, 0, 2 * Math.PI)
    ctx.stroke()

    let time = new Date();
    //绘制地球
    ctx.rotate(2 * Math.PI / 60 * time.getSeconds() + 2 * Math.PI / 60000 * time.getMilliseconds())
    ctx.translate(100, 0);
    ctx.drawImage(earth, -12, -12)

    //绘制月球轨道
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,.3)";
    ctx.arc(0, 0, 40, 0, 2 * Math.PI);
    ctx.stroke();

    //绘制月球
    ctx.rotate(2 * Math.PI / 6 * time.getSeconds() + 2 * Math.PI / 6000 * time.getMilliseconds());
    ctx.translate(40, 0);
    ctx.drawImage(moon, -3.5, -3.5);
    ctx.restore();

    requestAnimationFrame(draw);
}
```

太阳地球月球的图片：

[太阳](https://mdn.mozillademos.org/files/1456/Canvas_sun.png)

[月亮](https://mdn.mozillademos.org/files/1443/Canvas_moon.png)

[地球](https://mdn.mozillademos.org/files/1429/Canvas_earth.png)

**例如：**模拟时钟

```javascript
init();

function init() {
    let canvas = document.querySelector("#canvas");
    let ctx = canvas.getContext("2d");
    draw(ctx);
}

function draw(ctx) {
    requestAnimationFrame(function step() {
        drawDial(ctx); //绘制表盘
        drawAllHands(ctx); //绘制时分秒针
        requestAnimationFrame(step);
    });
}
/*绘制时分秒针*/
function drawAllHands(ctx) {
    let time = new Date();

    let s = time.getSeconds();
    let m = time.getMinutes();
    let h = time.getHours();

    let pi = Math.PI;
    let secondAngle = pi / 180 * 6 * s;  //计算出来s针的弧度
    let minuteAngle = pi / 180 * 6 * m + secondAngle / 60;  //计算出来分针的弧度
    let hourAngle = pi / 180 * 30 * h + minuteAngle / 12;  //计算出来时针的弧度

    drawHand(hourAngle, 60, 6, "red", ctx);  //绘制时针
    drawHand(minuteAngle, 106, 4, "green", ctx);  //绘制分针
    drawHand(secondAngle, 129, 2, "blue", ctx);  //绘制秒针
}
/*绘制时针、或分针、或秒针
   * 参数1：要绘制的针的角度
   * 参数2：要绘制的针的长度
   * 参数3：要绘制的针的宽度
   * 参数4：要绘制的针的颜色
   * 参数4：ctx
   * */
function drawHand(angle, len, width, color, ctx) {
    ctx.save();
    ctx.translate(150, 150); //把坐标轴的远点平移到原来的中心
    ctx.rotate(-Math.PI / 2 + angle);  //旋转坐标轴。 x轴就是针的角度
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(len, 0);  // 沿着x轴绘制针
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

/*绘制表盘*/
function drawDial(ctx) {
    let pi = Math.PI;

    ctx.clearRect(0, 0, 300, 300); //清除所有内容
    ctx.save();

    ctx.translate(150, 150); //一定坐标原点到原来的中心
    ctx.beginPath();
    ctx.arc(0, 0, 148, 0, 2 * pi); //绘制圆周
    ctx.stroke();
    ctx.closePath();

    for (let i = 0; i < 60; i++) {//绘制刻度。
        ctx.save();
        ctx.rotate(-pi / 2 + i * pi / 30);  //旋转坐标轴。坐标轴x的正方形从 向上开始算起
        ctx.beginPath();
        ctx.moveTo(110, 0);
        ctx.lineTo(140, 0);
        ctx.lineWidth = i % 5 ? 2 : 4;
        ctx.strokeStyle = i % 5 ? "blue" : "red";
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
    ctx.restore();
}
```

### 9 状态的保存和恢复

`Saving and restoring state`是绘制复杂图形时必不可少的操作。

 `save` 和 `restore` 方法是用来保存和恢复 `canvas` 状态的，都没有参数。

 `Canvas` 的状态就是当前画面应用的所有样式和变形的一个快照。

1. 关于 `save()`

   Canvas状态存储在栈中，每当`save()`方法被调用后，当前的状态就被推送到栈中保存。一个绘画状态包括：

   - 当前应用的变形（即移动，旋转和缩放）
   - `strokeStyle`, `fillStyle`, `globalAlpha`, `lineWidth`, `lineCap`, `lineJoin`, `miterLimit`, `shadowOffsetX`, `shadowOffsetY`, `shadowBlur`, `shadowColor`, `globalCompositeOperation 的值`
   - 当前的裁切路径（`clipping path`）

   **可以调用任意多次 `save`方法。**(类似数组的`push()`)

2. 关于`restore()`

   每一次调用 `restore` 方法，上一个保存的状态就从栈中弹出，所有设定都恢复。(类似数组的`pop()`)



参考：
https://blog.csdn.net/u012468376/article/details/73350998

https://segmentfault.com/a/1190000008871433

