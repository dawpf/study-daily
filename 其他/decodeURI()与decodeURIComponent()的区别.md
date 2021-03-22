# decodeURI() 与 decodeURIComponent() 的区别

编码函数

- `encodeURI()` 会对特殊字符进行编码（￥ %）：`￥` 对应 `%EF%BF%A5`；空格对应 `%20` ；`%` 对应 `%25`
- `encodeURIComponent()`  不会对特殊字符进行编码（￥ %）

解码函数

- `decodeURI()` 可对 `encodeURI()` 函数编码过的 URI 进行解码
- `decodeURIComponent()` 可对 `encodeURIComponent()` 函数编码的 URI 进行解码

**例如：**

```javascript
  const aaa = '#$ ￥%23ccc/'
  
  console.log(encodeURI(aaa));	// #$%20%EF%BF%A5%2523ccc/
  console.log(decodeURI(aaa));	// #$ ￥%23ccc/
  console.log(encodeURIComponent(aaa));	// %23%24%20%EF%BF%A5%2523ccc%2F
  console.log(decodeURIComponent(aaa));	// #$ ￥#ccc/
```

所以我们在获取地址栏参数是通常封装成如下函数：

```javascript
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}
```

