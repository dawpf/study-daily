# BFC

## 1 为什么会有BFC？

从理论上来讲，被包含在父元素里的元素是不会影响到父元素旁边的元素，但实际上并不总是如此。那么有什么办法让里面的元素和外面元素真正隔离开？因此有了BFC

**父元素受子元素影响例子**：子元素浮动，父元素的高度被压缩变为 0

## 2 BFC 的定义

BFC: block formatting context 块级格式化上下文。
BFC的目的就是形成一个完成独立的空间，让空间中的子元素不会影响到外面的元素。

## 3 如何触发 BFC

触发BFC有4种方式

- float 不为 none
- position 不为 relative 和 static
- overflow 为 auto / scroll / hidden
- display 的值为 table-cell 或 inline-block

## 4 BFC 可以解决的问题

### 1. 浮动元素令父元素高度坍塌

假设一个页面中有一个父元素和几个子元素，子元素都设为浮动，那么父元素高度将会塌陷，这是因为浮动的子元素脱离了文档流。由于父元素高度的塌陷，那么也会影响到父元素周围的其他元素。

如何解决呢？这时就可以给父元素添加 `overflow: hidden;` 来使父元素成为一个 BFC。

```html
<!DOCTYPE html>
<html>

<head>
  <title>BFC</title>
  <style type="text/css">
    #parent1 {
      width: 1000px;
      background: #ccc;
      /* overflow: hidden; */
      /* float: left; */
    }

    #parent2 {
      width: 500px;
      height: 500px;
      background: skyblue;
    }

    #child1 {
      width: 100px;
      height: 100px;
      background: red;
      float: left;
    }

    #child2 {
      width: 100px;
      height: 100px;
      background: green;
      float: left;
    }

    /* 	#parent1::after {
			display: block;
			content: '';
			clear: both;
		} */
    /* #temp {
			clear: both;
		} */
  </style>
</head>

<body>
  <div id="parent1">
    <div id="child1"></div>
    <div id="child2"></div>
    <!-- <div id="temp"></div> -->
  </div>
  <div id="parent2">

  </div>
</body>

</html>
```

通过触发BFC来避免塌陷情况：

```css
#parent1 {
    width: 1000px;
    background: #ccc;
    overflow: hidden;
    /* float: left; */
}
```

**触发了BFC的容器就是页面上完全隔离开的容器，容器里的子元素绝对不会影响到外面的元素。为了保证这个规则，触发了BFC的父元素在计算高度时，不得不让参与浮动的子元素也参与进来，变相的实现了清除内部浮动的目的。**

但有的时候出于布局需要也可能无法给父元素设置这些属性，而解决高度坍塌，常用的还有如下办法：

- **让父元素也浮动起来，这样父元素和子元素一起脱离文档流。因此父元素就能自适应子元素的高度**

  **注意：**`这种父元素也会脱离文档流。`

  ```css
  #parent1 {
      width: 1000px;
      background: #ccc;
      /* overflow: hidden; */
      float: left;
  }
  ```

  优点：代码量少。
  缺点：影响之后的元素排列，而引发其他问题。

- **给父元素添加一个固定高度，但是这个方式只适用已知子元素高度的情况下。**

  优点：没有学习成本。
  缺点：不灵活，也难以维护。

- **在浮动元素后面添加一个空元素，并设置`clear: both`**

  ```html
  <div id="parent1">
      <div id="child1"></div>
      <div id="child2"></div>
      <div style="clear:both;"></div>
  </div>
  <div id="parent2">
  
  </div>
  ```

  优点：简单易懂，容易掌握。
  缺点： 会增加无意义的标签。

- ##### 为浮动的最后一个子元素设置一个伪元素 `::after {content: '';clear:both;}`

  **注意:** `在使用浮动进行布局的时候会需要一个块级元素（行内元素无效）来设置 clear 属性`

  ```css
  #parent1 {
      width: 1000px;
      background: #ccc;
      /* overflow: hidden; */
      /* float: left; */
  }
  
  #parent1::after {
      display: block;
      content: '';
      clear: both;
  }
  ```

### 2. 解决自适应布局的问题

文字太长产生环绕时：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <style>
    .box {
      width: 100px;
      height: 130px;
      background: #cccccc;
      float: left;
    }

    .content {
      background: #cc0000;
      /* overflow: hidden; */
    }
  </style>
</head>

<body>
  <div class="box">
  </div>
  <div class="content">
    <p>
      发了疯的骄傲了放假啊练腹肌奥拉夫骄傲了放假啊了司法局案例书法家阿里放假啊练腹肌奥拉夫骄傲了发了飞机案例附件奥拉夫建安费；案件案发；练腹肌奥拉夫骄傲了放假啊；发发了飞机阿拉；率阿里
      发了疯的骄傲了放假啊练腹肌奥拉夫骄傲了放假啊了司法局案例书法家阿里放假啊练腹肌奥拉夫骄傲了发了飞机案例附件奥拉夫建安费；案件案发；练腹肌奥拉夫骄傲了放假啊；发发了飞机阿拉；率阿里
      发了疯的骄傲了放假啊练腹肌奥拉夫骄傲了放假啊了司法局案例书法家阿里放假啊练腹肌奥拉夫骄傲了发了飞机案例附件奥拉夫建安费；案件案发；练腹肌奥拉夫骄傲了放假啊；发发了飞机阿拉；率阿里
      发了疯的骄傲了放假啊练腹肌奥拉夫骄傲了放假啊了司法局案例书法家阿里放假啊练腹肌奥拉夫骄傲了发了飞机案例附件奥拉夫建安费；案件案发；练腹肌奥拉夫骄傲了放假啊；发发了飞机阿拉；
    </p>
  </div>

</body>

</html>
```

右边盒子文字过长，会导致左边盒子被环绕

将页面右面的容器触发BFC，触发后就会变成一个完全隔离开的容器，容器里的子元素绝对不会影响到外面的元素，进而实现两栏布局：

```css
.content {
    background: #cc0000;
    overflow: hidden;
}
```

其他方式实现左侧固定，右侧自适应的

- 左边左浮动，右边设置margin-left
- 左边绝对定位，右边设置margin-left
- flex布局

### 3 解决外边距垂直方向重合的问题

例如：

```html
<!DOCTYPE html>
<html>

<head>
  <title></title>
  <style type="text/css">
    #top {
      width: 100px;
      height: 100px;
      background: red;
      margin-bottom: 20px;
    }

    #bottom {
      width: 100px;
      height: 100px;
      background: green;
      margin-top: 20px;
    }

    /* #wrapper {
			overflow: hidden;
		} */
  </style>
</head>

<body>
  <div id="top"></div>
  <!-- <div id="wrapper"> -->
  <div id="bottom"></div>
  <!-- </div> -->

</body>

</html>
```

`#top` 和 `#bottom` 之间的间距应为 40px，但实际上为 20px

**解决办法：**使其中一个加一层父元素，并使父元素触发BFC

```html
<!DOCTYPE html>
<html>

<head>
  <title></title>
  <style type="text/css">
    #top {
      width: 100px;
      height: 100px;
      background: red;
      margin-bottom: 20px;
    }

    #bottom {
      width: 100px;
      height: 100px;
      background: green;
      margin-top: 20px;
    }

    #wrapper {
      overflow: hidden;
    }
  </style>
</head>

<body>
  <div id="top"></div>
  <div id="wrapper">
    <div id="bottom"></div>
  </div>

</body>

</html>
```

**总结：**

- BFC的含义：块级格式化上下文。目的：形成一个完成独立的空间，让空间中的子元素不会影响到外面的元素。
- 形成BFC的常用条件：4个
- BFC的应用场景：3个