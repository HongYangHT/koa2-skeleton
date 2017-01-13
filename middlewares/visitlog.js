/*
* @Author: lizhonghui
* @Date:   2017-01-11 21:28:14
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-12 14:00:21
*/

const logger = require('../libs/logger');
const URL = require('url');
const _ = require('lodash');
const onFinished = require('on-finished')
const onHeaders = require('on-headers')

module.exports = async function(ctx, next) {
  recordStartTime.call(ctx.req);
  logReqeust(ctx);
  onHeaders(ctx.res, recordStartTime);
  onFinished(ctx.res, () => logResponse(ctx));

  await next();

}

function logReqeust(ctx) {
  let req = ctx.req;
  let url = req.originalUrl || req.url
    , method = req.method
    , referer = req.headers['referer'] || req.headers['referrer'] || '?'
    , remoteAddr = req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || '?'
    , userAgent = req.headers['user-agent'];
  let reqBody = parseBody(req.body);
  logger.debug(`${ctx.reqid} - userRequest - ${method} - ${url} - ${remoteAddr} - ${referer} - ${userAgent}` + (reqBody ? (' - ' + reqBody) : ''));
}

function logResponse(ctx) {
  let resBody
    , req = ctx.req
    , res = ctx.res;
  let responseTime = getResponseTime(req, res) || '?'
    , status = res._header ? res.statusCode : '?'
    , contentLength = res.getHeader('content-length') || '?';

  if(ctx.resBody && ctx.resBody.code !== 0) {
    resBody = parseBody(ctx.resBody);
  }

  logger.debug(`${ctx.reqid} - userResponse - ${status} - ${responseTime}ms - ${contentLength}` + (resBody ? ' - ' + resBody : ''));
}

function parseBody(body) {
  let strBody;
  if(_.isPlainObject(body)) {
    strBody = JSON.stringify(body);
  } else if(_.isString(body)) {
    strBody = body;
  }
  return strBody;
}

// from morgan
function getResponseTime(req, res) {
  if (!req._startAt || !res._startAt) {
    // missing request and/or response start time
    return
  }

  // calculate diff
  var ms = (res._startAt[0] - req._startAt[0]) * 1e3
    + (res._startAt[1] - req._startAt[1]) * 1e-6

  // return truncated value
  return ms.toFixed(3)
}

function recordStartTime() {
  this._startAt = process.hrtime()
}

