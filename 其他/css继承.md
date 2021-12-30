css继承介绍

- 外层元素身上的样式会被内层元素所继承。
- 当内层元素身上的样式与外层的元素身上的样式相同时内层元素样式会覆盖外层元素样式。
- 只有文本与字体样式属性才能够被继承，其余的样式属性不可以被继承。

### 1 外层元素身上的样式会被内层元素所继承

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<style>
  body {
    color: red;
    font-size: 20px;
  }
</style>

<body>

  <div>
    <p>p标签</p>
    <div>div标签</div>
  </div>

  <span>span标签</span>

</body>

</html>
```

### 2 内层元素身上的样式与外层的元素身上的样式相同时内层元素样式会覆盖外层元素样式

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<style>
  body {
    color: red;
    font-size: 20px;
  }

  div {
    color: green;
  }
</style>

<body>

  <div>
    <p>p标签</p>
    <div>div标签</div>
  </div>

  <span>span标签</span>

</body>

</html>
```

**注：**若没有权重问题，body 和 div 标签样式写的顺序不影响最后的渲染效果，即这样也是一样的：

```css
div {
    color: green;
}

body {
    color: red;
    font-size: 20px;
}
```

### 3 只有文本与字体样式属性才能够被继承，其余的样式属性不可以被继承

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<style>
  body {
    color: red;
    font-size: 20px;
    border: 1px solid #000;
  }

  div {
    color: green;
  }
</style>

<body>

  <div>
    <p>p标签</p>
    <div>div标签</div>
  </div>

  <span>span标签</span>

</body>

</html>
```

