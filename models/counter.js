/*
* @Author: lizhonghui
* @Date:   2017-01-11 17:36:32
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-13 17:04:52
*/

let rp = require('request-promise');

var Errors = require('../libs/errors');
var _ = require('lodash');

// 哪些返回码标记为用户级错误
var extractCodes = {
  "9001": "交易时间非法",
  "9002": "购买份额超过可用份额",
  "9003": "该代码当前时间不允许操作",
  "9004": "客户不存在"
};

var counterRequest = rp.defaults({
  json: true,
  timeout: 10000,
  uri: 'http://test.com',
  method: 'POST',
  transform(body) {
    /**
     * 解包
     * - 公共的错误处理
     * - 磨平不同接口的参数规则，对外提供统一的返回数据规则
     */
    if(!body) return Errors.EmptyError;
    if(body.errorno === 0) {
      return {
        code: 0,
        data: body.datas
      }
    }
    else {
      var errInfo = body.errorinfo, errNo = body.errorno;
      var m = /\[(\d+)\]/.exec(errInfo);
      if(m && m[1]) errNo = parseInt(m[1]);
      if(errNo) {
        return {
          code: parseInt(errNo),
          msg: extractCodes[errNo] || Errors.InterfError.msg
        }
      }
      else {
        return Errors.InterfError;
      }
    }
  }
});

function request(options, reqid) {
  if(reqid) {
    if(_.isString(options)) {
      options = {
        uri: options
      }
    }
    options.headers = options.headers || {};
    options.headers.reqid = reqid;
  }
  return counterRequest(options).catch(err => {
    return Errors.InterfError
  });
}

module.exports = {
  request
}
