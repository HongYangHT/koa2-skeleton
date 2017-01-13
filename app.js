/*
* @Author: lizhonghui
* @Date:   2017-01-10 17:23:04
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-12 20:24:14
*/

const logger = require('./libs/logger');
const _ = require('lodash');

require('./init');

const Koa = require('koa');

const app = module.exports = new Koa();
app.keys = ['koa2-skeleton'];

// request id
app.use(require('./middlewares/reqid'));

app.use(require('koa-helmet')());

app.use(require('./middlewares/visitlog'));
app.use(require('./middlewares/response'));

app.use(require('koa-response-time')());
app.use(require('koa-conditional-get')());
app.use(require('koa-etag')());
app.use(require('koa-compress')({
  flush: require('zlib').Z_SYNC_FLUSH
}));
app.use(require('koa-bodyparser')());

// static file serving
const serve = require('koa-static');
app.use(serve(__dirname + '/public'));
const favicon = require('koa-favicon');
app.use(favicon(__dirname + '/public/favicon.ico'));

// router
app.use(require('./middlewares/router'));

// template
const co = require('bluebird').coroutine;
const render = require('koa-swig');
app.context.render = co(render({
  root: __dirname + '/views',
  autoescape: true,
  cache: 'memory', // disable, set to false
  ext: 'html',
  writeBody: false
}));

const http = require('http');
const server = http.createServer(app.callback());
server.listen(process.env.PORT || 3000)
server.on('listening', () => {
  console.log('Server listening on http://localhost:%d', server.address().port);
});

process.on('uncaughtException', err => {
  if(_.isString(err)) err = new Error(err);
  logger.error(err.stack);
  try {
    var killTimer = setTimeout(() => {
      process.exit(1);
    }, 30000);
    killTimer.unref();
    server.close();
  } catch (e) {
    logger.error('error when exit', e.stack);
  }
});


module.exports = app
