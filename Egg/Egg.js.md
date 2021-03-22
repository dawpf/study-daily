# Egg

**简介**

`Egg` 继承于 `Koa`，`Egg` 选择了 `Koa` 作为其基础框架，在它的模型基础上，进一步对它进行了一些增强

`Koa` 的中间件选择了洋葱圈模型（像穿过一个洋葱一样）

所有的请求经过一个中间件的时候都会执行两次，对比 `Express` 形式的中间件，`Koa` 的模型可以非常方便的实现后置处理逻辑，可以看到执行是从前到后再从后到前。

## 1 项目准备

- 安装 `egg` 脚手架

  ```
  $ npm i egg-init -g
  ```

- 使用脚手架创建项目

  ```
  $ egg-init egg-example --type=simple $ cd egg-example
  $ npm i
  ```

- 运行项目

  ```
  $ npm run dev
  $ open localhost:7001
  ```

## 2 项目说明

主要包括了项目本身的东西，以及相关知识点的重点解释

### 1 目录结构及说明

```
egg-project
├── package.json
├── app.js (可选)				用于自定义启动时的初始化工作（初始化时没有,无需配置手动添加稳健即可）
├── agent.js (可选)			用于自定义启动时的初始化工作
├── app
|   ├── router.js				用于配置 URL 路由规则
│   ├── controller				用于解析用户的输入，处理后返回相应的结果
│   |   └── home.js
│   ├── service (可选)		   用于编写业务逻辑层
│   |   └── user.js
│   ├── middleware (可选)		   用于编写中间件
│   |   └── response_time.js
│   ├── schedule (可选)		   用于定时任务
│   |   └── my_task.js
│   ├── public (可选)			   用于放置静态资源
│   |   └── reset.css
│   ├── view (可选)			   列表页模板文件
│   |   └── home.tpl
│   └── extend (可选)			   用于框架的扩展
│       ├── helper.js (可选)
│       ├── request.js (可选)
│       ├── response.js (可选)
│       ├── context.js (可选)
│       ├── application.js (可选)
│       └── agent.js (可选)
├── config
|   ├── plugin.js				用于配置需要加载的插件
|   ├── config.default.js		config.***.js用于编写配置文件
│   ├── config.prod.js			用于编写配置文件
|   ├── config.test.js (可选)
|   ├── config.local.js (可选)
|   └── config.unittest.js (可选)
└── test						用于单元测试
    ├── middleware
    |   └── response_time.test.js
    └── controller
        └── home.test.js
```

### 2 文件加载顺序

Egg 将应用、框架和插件都称为加载单元（`loadUnit`）

Egg 会遍历所有的 `loadUnit` 需要加载的文件（应用、框架、插件各有不同），加载时有一定的优先级。

- 按插件 => 框架 => 应用，依次加载
- 插件之间的顺序由依赖关系决定，被依赖方先加载，无依赖按 object key 配置顺序加载
- 框架按继承顺序加载，越底层越先加载

### 3 生命周期

生命周期如下：

- 配置文件即将加载，这是最后动态修改配置的时机（`configWillLoad`）
- 配置文件加载完成（`configDidLoad`）
- 文件加载完成（`didLoad`）
- 插件启动完毕（`willReady`）
- worker 准备就绪（`didRead`）
- 应用启动完成（`serverDidReady`）
- 应用即将关闭（`beforeClose`）

```javascript
// app.js
class AppBootHook {
  constructor(app) {
    this.app = app;
  }
  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
    console.log('configWillLoad');
  }
  configDidLoad() {
    // Config, plugin files have been loaded.
    console.log('configDidLoad');
  }
  async didLoad() {
    // All files have loaded, start plugin here.
    console.log('didLoad');
  }
  async willReady() {
    // All plugins have started, can do some thing before app ready
    console.log('willReady');
  }
  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
    console.log('didReady');
  }
  async serverDidReady() {
    // Server is listening.
    console.log('serverDidReady');
  }
  async beforeClose() {
    // Do some thing before app close.
    console.log('configWillLoad');
  }
}
module.exports = AppBootHook;
```

### 4 框架内置及扩展对象

框架中内置的一些基础对象，包括从 `Koa` 继承而来的 4 个对象

**注：**可以在谷歌浏览器下载 `FeHelper前端助手` 把实例化的 `this` 对象打印到页面里面，分析里面的结构

#### Application

`Application` 是全局应用对象，在一个应用中，只会实例化一个，它继承自 `Koa.Application`，在它上面我们可以挂载一些全局的方法和对象。

**事件：**

- `server` 该事件一个 worker 进程只会触发一次，在 HTTP 服务完成启动后，会将 HTTP server 通过这个事件暴露出来给开发者

- `error` 运行时有任何的异常被 `onerror` 插件捕获后，都会触发 `error` 事件

- `request` 和 `response` 应用收到请求和响应请求时，分别会触发 `request` 和 `response` 事件

```javascript
// app.js
module.exports = app => {
  app.once('server', server => {
    // websocket
    console.log('server', server);
    
  });
  app.on('error', (err, ctx) => {
    // report error
    console.log('error', err);
  });
  app.on('request', ctx => {
    // log receive request
    console.log('request');
  });
  app.on('response', ctx => {
    // ctx.starttime is set by framework
    const used = Date.now() - ctx.starttime;
    // log total cost
    console.log('used', used);
  });
};

// 初始化的时候会打印 server Server 
// request
// used 6
// request
// used 1
```

**获取方式：**

几乎所有被框架 `oader` 加载的文件（`Controller`，`Service`，`Schedule` 等），都可以 `export` 一个函数，这个函数会被 `Loader` 调用，并使用 `app` 作为参数

```javascript
// app.js
module.exports = app => {
  app.getData = (data) => {
    return `get${data}`
  }
};
```

```javascript
// app/controller/home.js
const Controller = require('egg').Controller;

class HomeController extends Controller {

  async index() {
    const { ctx } = this;
    // ctx.body = 'hi, egg';
    ctx.body = this.app.getData('123456789')
  }
}

module.exports = HomeController;
```

页面刷新，此时页面上会显示 `get123456789`

#### Context

`Context` 是一个请求级别的对象，继承自 `Koa.Context`

在每一次收到用户请求时，框架会实例化一个 `Context` 对象，这个对象封装了这次用户请求的信息，并提供了许多便捷的方法来获取请求参数或者设置响应信息

**获取方式：**

除了在请求时可以获取 Context 实例之外， 在有些非用户请求的场景下我们需要访问 service / model 等 Context 实例上的对象，可以用 `Application.createAnonymousContext()` 方法创建一个匿名 Context 实例。

```javascript
// app.js
module.exports = app => {
  app.beforeStart(async () => {
    const ctx = app.createAnonymousContext();
    // preload before app start
    await ctx.service.posts.load();
  });
}
```

在定时任务中的每一个 task 都接受一个 Context 实例作为参数

```javascript
// app/schedule/refresh.js
exports.task = async ctx => {
  await ctx.service.posts.refresh();
};
```

#### Request & Response

- `Request` 是一个请求级别的对象，继承自 `Koa.Request`。封装了 `Node.js` 原生的 `HTTP Request` 对象，提供了一系列辅助方法获取 `HTTP` 请求常用参数

- `Response` 是一个请求级别的对象，继承自 `Koa.Response`。封装了 `Node.js` 原生的 `HTTP Response` 对象，提供了一系列辅助方法设置 `HTTP` 响应

**获取方式：**

可以在 `Context` 的实例上获取到当前请求的 `Request(ctx.request)` 和 `Response(ctx.response)` 实例。

```javascript
// app/controller/user.js
class UserController extends Controller {
  async fetch() {
    const { app, ctx } = this;
    const id = ctx.request.query.id;
    ctx.response.body = id
  }
}
// 这样就能通过 ctx.request.query.id 获取 /index?id=111  中的id：111了
```

- `Koa` 会在 `Context` 上代理一部分 `Request` 和 `Response` 上的方法和属性，参见 `Koa.Context`

- 如上面例子中的 `ctx.request.query.id` 和 `ctx.query.id` 是等价的，`ctx.response.body=` 和 `ctx.body=` 是等价的

- 需要注意的是，获取 POST 的 body 应该使用 `ctx.request.body`，而不是 `ctx.body`

#### Controller

框架提供了一个 `Controller` 基类，并推荐所有的 `Controller` 都继承于该基类实现。

这个 `Controller` 基类有下列属性：

- `ctx` - 当前请求的 Context 实例
- `app` - 应用的 Application 实例
- `config` - 应用的配置
- `service` - 应用所有的 service
- `logger` - 为当前 controller 封装的 logger 对象

在 `Controller` 文件中，可以通过两种方式来引用 `Controller` 基类：

```javascript
// app/controller/home.js

// 从 egg 上获取（推荐）
const Controller = require('egg').Controller;
class UserController extends Controller {
  // implement
}
module.exports = UserController;

// 从 app 实例上获取
module.exports = app => {
  return class UserController extends app.Controller {
    // implement
  };
};
```

#### Service

框架提供了一个 `Service` 基类，并推荐所有的 `Service` 都继承于该基类实现。

`Service` 基类的属性和 `Controller` 基类属性一致，访问方式也类似：

```javascript
// app/service/user.js

// 从 egg 上获取（推荐）
const Service = require('egg').Service;
class UserService extends Service {
  // implement
}
module.exports = UserService;

// 从 app 实例上获取
module.exports = app => {
  return class UserService extends app.Service {
    // implement
  };
};
```

#### Helper

`Helper` 用来提供一些实用的 `utility` 函数。它的作用在于我们可以将一些常用的动作抽离在 `helper.js` 里面成为一个独立的函数，这样可以用 `JavaScript` 来写复杂的逻辑，避免逻辑分散各处，同时可以更好的编写测试用例。

`Helper` 自身是一个类，有和 `Controller` 基类一样的属性，它也会在每次请求时进行实例化，因此 `Helper` 上的所有函数也能获取到当前请求相关的上下文信息。

**获取方式**

可以在` Context` 的实例上获取到当前请求的 `Helper(ctx.helper)` 实例。

```javascript
// app/controller/user.js

class UserController extends Controller {
  async fetch() {
    const { app, ctx } = this;
    const id = ctx.query.id;
    const user = app.cache.get(id);
    ctx.body = ctx.helper.formatUser(user);
  }
}
```

#### Config

推荐应用开发遵循配置和代码分离的原则，将一些需要硬编码的业务配置都放到配置文件中，同时配置文件支持各个不同的运行环境使用不同的配置，使用起来也非常方便，所有框架、插件和应用级别的配置都可以通过 `Config` 对象获取到。

**获取方式：**

通过 `app.config` 从 `Application` 实例上获取到 `config` 对象，也可以在 `Controller, Service, Helper` 的实例上通过 `this.config` 获取到 `config` 对象。

#### Logger

每一个 logger 对象都提供了 4 个级别的方法：

- `logger.debug()`
- `logger.info()`
- `logger.warn()`
- `logger.error()`

**获取方式：**

- `app.logger` 如果我们想做一些应用级别的日志记录，如记录启动阶段的一些数据信息，记录一些业务上与请求无关的信息，都可以通过 `App Logger` 来完成
- `app.coreLogger` 在开发应用时都不应该通过 `CoreLogger` 打印日志，而框架和插件则需要通过它来打印应用级别的日志，这样可以更清晰的区分应用和框架打印的日志，通过 `CoreLogger` 打印的日志会放到和 `Logger` 不同的文件中
- `ctx.logger` 从 Context 实例上获取到它，从访问方式上我们可以看出来，`Context Logger` 一定是与请求相关的，它打印的日志都会在前面带上一些当前请求相关的信息（如`[$userId/$ip/$traceId/${cost}ms $method $url]`）
- `this.logger` 可以在 `Controller` 和 `Service` 实例上通过 `this.logger` 获取到它们，它们本质上就是一个 `Context Logger`，不过在打印日志的时候还会额外的加上文件路径

------

**至此，结合我们之前为 `vue` 项目配置的反向代理，新建一个 `vue` 项目封装，二次封装 `axios` 然后就可以发送请求，这样，我们就可以简单的从我们自己搭建的服务器里面获取到数据**

**注：**

提交代码到 `github` 之前，把本地根目录下 `Github` 文件夹删除，否则会报错提交失败

------

## 3 运行环境及 Config 配置

使用不同的运行命令，就可以使用不同的环境运行项目

```javascript
npm run dev  	// 本地环境
npm run start 	// 生产环境
```

可以通过 `app.config.env` 获取当前开发环境

```javascript
local   	// 本地环境
prod		// 生产环境
unittest	// 测试环境
```

### 1 多环境配置

框架支持根据环境来加载配置，定义多个环境的配置文件

```javascript
// config 文件夹下
config
|- config.default.js
|- config.prod.js
|- config.unittest.js
|- config.local.js
|- config.xxx.js
```

`config.default.js` 为默认的配置文件，所有环境都会加载这个配置文件，一般也会作为开发环境的默认配置文件。

当指定 `env` 时 **会同时加载对应的配置文件，并覆盖默认配置文件的同名配置**。如 `prod` 环境会加载 `config.prod.js` 和 `config.default.js` 文件，`config.prod.js` 会覆盖 `config.default.js` 的同名配置。

### 2 配置写法

配置文件返回的是一个 `object` 对象，可以覆盖框架的一些配置，应用也可以将自己业务的配置放到这里方便管理，获取时直接通过 `app.config`。

配置文件返回的是一个 `object` 对象，可以覆盖框架的一些配置，应用也可以将自己业务的配置放到这里方便管理，获取时直接通过 `app.config`。

- **导出对象式写法**

  ```javascript
  // 配置 logger 文件的目录，logger 默认配置由框架提供
  
  module.exports = {
    logger: {
      dir: '/home/admin/logs/demoapp',
    },
  };
  ```

- **配置文件也可以返回一个 function，可以接受** `appInfo` **参数**

  ```javascript
  // config/config.default.js
  
  const path = require('path');
  
  module.exports = appInfo => {
  
    const config = exports = {
      NODE_ENV_MY: appInfo.env === 'local' ? 'NODE_ENV_local11111' : 'NODE_ENV_pro111111',
      logger: {
        // 配置自定义日志打印目录为根目录下 /myLogs
        dir: path.join(appInfo.baseDir, 'myLogs'),  
      }
    };
  
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1605779526264_8413';
    // add your middleware config here
    config.middleware = [];
    // add your user config here
    const userConfig = {
      // myAppName: 'egg',
    };
  
    return {
      ...config,
      ...userConfig,
    };
  };
  
  ```

------

**这样，我们就能在 `/index` 里面通过打印出来的 `this` 来获取到配置好的 `NODE_ENV_MY` ，文件报错目录也由默认的 `logs` 改成了我们自定义 `myLogs`**
