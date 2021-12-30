position:fixed 实现相对于父元素定位

比如：中间内容区域的大小固定为1000px，对应不同的浏览器宽度，要使得某一个资源子固定在相对于内容区域的某一个位置，就不能使用 left:xxx，right:xxx这样写

`position:fixed` 是对于浏览器窗口定位的，要实现相当于父元素定位，可以这样：

```html
<style>
  .fa {
    width: 500px;
    height: 5000px;
    background-color: red;
    margin: 0 auto;
  }

  .son {
    width: 100px;
    height: 100px;
    background-color: green;
    position: fixed;
    margin-left: 510px;
  }
</style>

<body>

  <div class="fa">
    <div class="son"></div>
  </div>

</body>
```

这样，`son` 元素就会一直在 `fa` 元素往右10px的位置固定在页面中了

