/*
* @Author: lizhonghui
* @Date:   2017-01-11 21:18:15
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-12 13:30:29
*/

const instanceSymbol = Math.random().toString(36).substr(2, 14);
let globalReqId = 0;

async function mark(ctx, next) {
  ctx.reqid = ctx.req.reqid = instanceSymbol + (globalReqId++);
  await next();
}

module.exports = mark;
