/*
* @Author: lizhonghui
* @Date:   2017-01-11 17:36:32
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-16 22:23:11
*/

let rp = require('request-promise');

var Errors = require('../libs/errors');
var _ = require('lodash');

// mark inner return code which can be displayed on the user client
var extractCodes = {
  "9001": "parameters invalid"
};

var counterRequest = rp.defaults({
  json: true,
  timeout: 10000,
  uri: 'http://test.com',
  method: 'POST',
  transform(body) {
    /**
     * Package Decode
     * - Common error haandling
     * - Polish the parameters rules of different interfaces, to provide a unified output rules
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
