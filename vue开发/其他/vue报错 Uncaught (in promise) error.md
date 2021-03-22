# VUE报错 Uncaught (in promise) error

**原因：**是因为后续并没有跟随任何 then | catch 语句，因此它将抛出错误，所以要养成良好习惯，promise记得写上catch

可尝试在 `then()` 后加上 `catch()`

```javascript
login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      const payLoad = {
        name: username,
        password: password
      }

      login(payLoad).then(res => {
        if (res.code !== '0') {
          return reject(res)
        }
        commit('SET_TOKEN', res.token)
        setToken(res.token)
        resolve()

      }).catch(error => {  // 加上catch即可
        reject(error)
      })
    })
},
```

