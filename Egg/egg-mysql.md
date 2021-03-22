# egg-mysql

### 1 安装 Mysql

- 官网下载链接 ：[Mysql](https://dev.mysql.com/downloads/file/?id=499257) 选择下面 `No thanks, just start my download.`
- 安装Mysql： `Excute` - `Next` …一直到安装结束
- 配置环境变量
  - 找到 `Mysql` 安装目录 `bin` 文件夹下 例如：`C:\Program Files\MySQL\MySQL Server 8.0\bin`
  - 系统环境变量 - xxx的用户变量 - path 后面添加进上面的目录

### 2 egg内使用

官网地址：[Mysql](https://eggjs.org/zh-cn/tutorials/mysql.html)

- 安装依赖

  ```markdown
  npm i egg-mysql --save
  ```

- 配置模块

  ```javascript
  // config/plugin.js
  
  'use strict';
  
  exports.mysql = {
    enable: true,
    package: 'egg-mysql',
  }
  ```

- 配置与Mysql数据库的连接

  ```javascript
  // config/config.default.js
  // 或配置在对应环境下面
  
  'use strict';
  
  const path = require('path');
  
  module.exports = appInfo => {
  
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {
      NODE_ENV_MY: appInfo.env === 'local' ? 'NODE_ENV_local11111' : 'NODE_ENV_pro111111',
      logger: {
        dir: path.join(appInfo.baseDir, 'myLogs'),  // 配置自定义日志打印目录为根目录下 /myLogs
      }
    };
  
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1605779526264_8413';
  
    // add your middleware config here
    config.middleware = [];
      
    // 配置与Mysql数据库的连接
    config.mysql = {
      // 数据库信息配置
      client: {
        // host
        host: 'localhost',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: '123456',
        // 数据库名
        database: 'world',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: true,
    }
  
    // add your user config here
    const userConfig = {
      myAppName: 'egg1111',
    };
  
    return {
      ...config,
      ...userConfig,
    };
  };
  
  ```

- 对数据库进行操作

  ```javascript
  // app/controller/home.js
  
  'use strict';
  
  const Controller = require('egg').Controller;
  
  class HomeController extends Controller {
  
    async default() {
      const { ctx, app } = this;
      // ctx.body = 'hi, egg';
      ctx.body = `默认页面返回的数据,当前的开发环境为:${app.config.env}`
    }
  
    async index() {
      const { ctx, app } = this;
      ctx.response.body = { name: 111, age: 222 }
    }
  
    async fetch() {
      const { app, ctx, config } = this;
      const id = ctx.request.query.id;
      ctx.response.body = { name: 'zs', age: 18, id }
    }
  
    async info() {
      const { app, ctx, config } = this;
      const info = await app.mysql.select('city') // 查询整个city表
      ctx.response.body = info;
    }
  
  }
  
  module.exports = HomeController;
  
  ```

- 其他操作数据库的方法

  ```javascript
  // user为要操作的表
  
  // 1.查询一条数据，不管条件是什么，只能查一条
  let result = await this.app.mysql.get("user",{id:1})
  
  // 2.查询多条数据
  let result = await this.app.mysql.select(
      "user",{ where:{id:1} }
  )
  
  // 3.通过SQL语句查询数据
  let queryResult = await this.app.mysql.query(
    'select * from user'
  );
  
  // 4.通过SQL语句查询数据，查询条件为用户ID
  let user_id = 3;
  let queryResultById = await this.app.mysql.query(
    'select * from user where id=?', [user_id]
  );
  
  // 5.增加数据
  let result = await this.app.mysql.insert(
      "user",{username:"lisi",password:"1234"}
  )
  
  // 6.根据主键修改数据
  let userInfo = { id: 24, username: '二麻子' };
  let updateResultById = await this.app.mysql.update('user', userInfo);
  
  // 7. 按指定的用户ID删除数据
  let result= await this.app.mysql.delete('user',{ id:3 });
  
  ```

- 对应路由

  ```javascript
  // app/router.js
  
  'use strict';
  
  module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.default);
    router.get('/index', controller.home.index);
    router.get('/fetch', controller.home.fetch);
    router.get('/info', controller.home.info);
  };
  
  ```

至此，我们就能在 `http://localhost:7001/info` 页面看到从数据库里面获取到 `city` 表所有的数据了

**注意：**

在连接数据库时，经常会报错：

```
Client does not support authentication protocol requested by server
```

产生这个问题的原因是：

`mysql8` 之前的版本中加密规则是 `mysql_native_password` 而在 `mysql8` 之后,加密规则是

`caching_sha2_password` 。并提供了两种解决方案

- 升级 `navicat`，由于 `navicat` 是收费的，个人感觉升级会比较麻烦点。(使用 `navicat` 时报错的解决方案)
- 把用户密码登录的加密规则还原成 `mysql_native_password` 这种加密方式，选择第二种解决方案

**解决方案如下：**

1. 通过命令行进入解压的mysql根目录下。(以下命令需带上后面的分号 " ; " )

2. 登陆数据库

   `mysql -uroot -p`

3. 输入root的密码

   `Enter password: ******`

4. 更改加密方式（原样拷贝到命令窗中）

   `mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;`

5. 更改密码：该例子中 123456为新密码

   `mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';`

6. 刷新：

   `mysql> FLUSH PRIVILEGES;`