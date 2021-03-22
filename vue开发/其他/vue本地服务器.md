## `vue` 本地服务器

`vue` 在创建本地服务器时，本地 `ip` 地址配置错误的问题

```
Local:http://localhost:8086/
Network：unavailable
```

**解决方案：**

对 `vue` 项目进行配置，为项目配置 `ip` 地址

- 查看本地 `ip`

  - 命令提示符输入：`ipconfig`   

    ```
    无线局域网适配器 WLAN:
    
       连接特定的 DNS 后缀 . . . . . . . : lan
       本地链接 IPv6 地址. . . . . . . . : fe80::1169:7e1b:7f27:a379%2
       IPv4 地址 . . . . . . . . . . . . : 172.168.0.180
       子网掩码  . . . . . . . . . . . . : 255.255.0.0
       默认网关. . . . . . . . . . . . . : 172.168.0.1
    ```

  - 或者 **打开网络或 `internet` 配置** - `WLAN` - **查看当前 `wlan` 的属性** - `IPv4地址`

- 打开 `vue.config.js` 进行配置

  ```javascript
  module.exports = {
    ...,
    devServer: {
      // 配置服务器
      port: 8086,
      public: "172.168.0.180:8086", // 配置本地服务器ip，切换地区要重新配置！！
      open: true,
      https: false,
      overlay: {
        warnings: true,
        errors: true
      }
    },
    ...
  };
  
  ```

**至此，本地 `ip` 地址配置错误的问题，完成**