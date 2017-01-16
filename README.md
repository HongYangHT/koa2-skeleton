# Koa2-Skeleton

Using Koa2 to build Nodejs web server (without babel).

## Install

- Since babel is removed, make sure your nodejs version > 7.x
- Run `npm install` to get the necessary dependencies
- Run `npm start` to start the server
- Head over to http://localhost:3000

## Basic Feature

- Log Service: [tracer](https://github.com/baryon/tracer)
- Params Validation: [Joi](https://github.com/hapijs/joi)
- Template Engine: [swig](http://yangxiaofu.com/swig/)
- General Security: [helmet](https://github.com/helmetjs/helmet)
- Data Request: [request-promise](https://github.com/request/request-promise)
- Router: [lark-router](https://github.com/larkjs/lark-router)
- Simple and flexible multi-environment configuration

## Contributing

Pull requests if you feel like anything is not good enough or missing out.

## License

MIT

# Koa2脚手架

使用 Koa2 来构建 Nodejs Web 应用（非babel编译）

## 安装使用
- 无须Babel编译，确保你的Node版本不小于7.x
- 使用`npm install`安装依赖
- 使用`npm start`启动应用
- 浏览器打开 http://localhost:3000

## 基本功能

- 日志服务：[tracer](https://github.com/baryon/tracer)
- 数据验证：[Joi](https://github.com/hapijs/joi)
- 模板引擎：[swig](http://yangxiaofu.com/swig/)
- 通用安全：[helmet](https://github.com/helmetjs/helmet)
- 数据请求：[request-promise](https://github.com/request/request-promise)
- 路由功能：[lark-router](https://github.com/larkjs/lark-router)
- 简单灵活的多环境配置

## 开始使用

### 热更新
热更新策略（基于require.cache）开发中，现阶段推荐使用 node-dev，执行`npm install -g node-dev`安装，安装完后需要修改package.json的脚本，替换`node`为`node-dev`

### 错误处理
得益于 async/await 强大的错误处理能力，使用类似于同步的方式进行错误处理，关键中间件为：`middlewares/response.js`
```
 try {
    await next();
    // 正常数据返回处理
  }
  catch(err) {
    // 异常数据返回处理
  }
```
使用中间件的错误捕捉，对执行顺序比较敏感，这个中间件放在controller逻辑的前面。
基于async/await这种方式只能捕获到在其上下文里的错误，其他错误由`uncaughtexception`处理。

### 返回数据协议约定
对于API这类数据返回，约定结构如下：
- 返回码`code`：0表示成功，非0表示失败
- 消息提示`msg`：返回码非0时消息提示
- 数据包体`data`：数据payload

> 这个约定可以忽略，直接使用`ctx.body`也是没问题的。

遵循这个约定有一些方便的操作：
#### 1. 错误抛出：
若想在业务逻辑里抛出用户级错误，可标记expose为`true`，结合koa2，可这样实现
```
ctx.throw('用户级错误abc', { expose: true, code: 9001 });
```

抛出错误后，接口返回`{ code: 9001, msg: '用户级错误abc' }`

#### 2. 快捷构建返回包
为方便构建返回数据包，在`ctx`对象上新增3个对应字段`ctx.resCode`、`ctx.resMsg`、`ctx.resData`来替代`ctx.body`。
一些注意点：
- 只赋值resData，响应内容为：`{ code: 0, data: resData }`
- 只赋值resCode，且不为0，响应内容为：`{ code: resCode, msg: ctx.resMsg || '系统繁忙，请稍后重试' }`
- `libs/errors`定义了一些通用的用户级错误返回码

#### 3. 日志友好
赋值`resCode`、`resMsg`或者`resBody`可以使得log模块识别请求返回数据，并记录进日志里，方便还原用户场景，如：
```
2017-01-13T16:52:55+0800 <debug> visitlog.js(#47): fi4g0acifijjn10 - userResponse - 200 - 72.928ms - 36 - {"code":9001,"msg":"xxx error"}
```

### 数据验证
`Joi.validateThrow`是脚手架提供的工具函数，参数验证通过时，返回最终的数据对象；验证失败时抛出用户级错误。
```
let query = Joi.validateThrow(ctx.query, {
   pageNum: Joi.number().integer().min(1).default(1),
   pageSize: Joi.number().integer().min(1).max(100).default(10),
   fields: Joi.string().optional()
 });
```
 
### 测试
> 完善中...
 
### 日志使用

```
let logger = require('./libs/logger');
logger.debug('message');
```

共提供log、trace、debug、info、warn、error6个级别，默认输出级别设置为debug

日志格式为：
```
time - <level> - file(#line): reqid - xxx
```
reqid：用户请求ID，每次请求都会分配唯一的请求ID，存放在`ctx.reqid`


### 完整请求链路跟踪
`ctx.reqid`标记着每个请求的标志。

标记用户的请求进出使用`middlewares/visitlog.js`定制实现，参考morgan定制。
```
// request
2017-01-12T15:55:41+0800 <debug> visitlog.js(#32): hlsbupmbjmwpqc0 - userRequest - GET - /gfask/api - ::1 - ? - Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36
// response
2017-01-12T15:55:41+0800 <debug> visitlog.js(#47): hlsbupmbjmwpqc0 - userResponse - 200 - 60.259ms - 56 - {"code":14,"msg":"内部接口错误，请稍候重试"}
```

标记子请求进出使用`request-debug`实现：
```
let reqIdsMap = {};
require('request-debug')(request, (type, data) => {
  if(type === 'request') {
    let {debugId, uri, method, body} = data;
    let reqid = data.headers.reqid || '?';
    reqIdsMap[debugId] = reqid;
    logger.debug(`${reqid} - libRequest - ${debugId} - ${uri}` + (body ? ( '-' + body) : ''));
  }
  else if(type === 'response') {
    let {debugId, statusCode, body} = data;
    let reqid = reqIdsMap[debugId] || '?';
    logger.debug(`${reqid} - libResponse - ${debugId} - ${statusCode} - ${JSON.stringify(body)}`);
    reqIdsMap[debugId] = null;
  }
});
```

如上代码所示，若希望每个子请求里都能加上这个标志，需要在字请求的header里添加`reqid`才生效，如：
```
const rp = require('request-promise');
let result = await rp({
  headers: {
    reqid: ctx.id
  },
  // ...
})
```
> 打印出来的日志还可以加上用户ID，请求自行处理。

### 路由
定义路由文件为：controllers/business/api.js
```
module.exports = router => {
  router.get('/list', async ctx => {
  ctx.body = 'hello world';
  })
}
```
那么访问路径：localhost:3000/business/api/list

> 更多强大路由功能参考lark-router的github（https://github.com/larkjs/lark-router）。


