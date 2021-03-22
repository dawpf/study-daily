# wap-copy

**移动端 点击复制内容到剪切板**

```
yarn install

yarn serve
```

**主要代码**

```javascript
/*创建一个Input元素用来存放需要复制的数据*/
let tag = document.createElement('input');
tag.setAttribute('id', 'copy_input');

/*设置需要复制的内容*/
tag.value = "test";
document.getElementsByTagName('body')[0].appendChild(tag);
document.getElementById('copy_input').select();

/*复制到剪贴板*/
document.execCommand('copy');

/*完成复制，移除元素*/
document.getElementById('copy_input').remove();

alert('代码已复制')
```

