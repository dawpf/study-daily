# js判断滚动到底或滚动到顶

**原生判断**

其中：

- scrollTop：滚动条滚动时，滚动条上端距离顶部的距离
- clientHeight：可视区的高度
- scrollHeight：滚动条的总高度（当前可滚动的页面的总高度）

```javascript
window.addEventListener('scroll', scroll)

function scroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

      if (scrollTop === 0) {
        console.log('滚动到顶了');
      }

      if (scrollTop + clientHeight >= scrollHeight) {
        console.log('滚动到底了');
      }

}

window.removeEventListener('scroll', scroll) // 移除滚动事件
```

**jQuery判断**

```javascript
window.addEventListener('scroll', scroll)

function scroll() {
    const doc_height = $(document).height();
    const scroll_top = $(document).scrollTop();
    const window_height = $(window).height();
    if (scroll_top === 0) {
      console.log('滚动到顶了');
    } else if (scroll_top + window_height >= doc_height) {
      console.log('滚动到底了');
    }
}
```

**另**：vue项目中引入jQuery

```javascript
npm i jquery // 引入

import $ from 'jquery' // 使用
```

