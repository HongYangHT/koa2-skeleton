/*
* @Author: lizhonghui
* @Date:   2017-01-11 20:48:30
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-16 22:26:16
*/

const request = require('request-promise');
const logger = require('./libs/logger');
const Joi = require('joi');
const Errors = require('./libs/errors')

/**
 * [validateThrow: throw error when parameters are invalid, or return formatted data when valid]
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
Joi.validateThrow = function() {
  let result = Joi.validate.apply(Joi, arguments);
  let err = result.error;
  if (err) {
    err.expose = true;
    err.status = 400;
    err.code = Errors.ParamError.code;
    throw err;
  } else {
    return result.value;
  }
};


let reqIdsMap = {};
require('request-debug')(request, (type, data) => {
  let reqid;
  switch(type) {
    case 'request':
      var {debugId, uri, method, body} = data;
      reqid = data.headers.reqid || '?';
      reqIdsMap[debugId] = reqid;
      logger.debug(`${reqid} - libRequest - ${debugId} - ${uri}` + (body ? ( '-' + body) : ''));
      break;
    case 'response':
      var {debugId, statusCode, body} = data;
      reqid = reqIdsMap[debugId] || '?';
      logger.debug(`${reqid} - libResponse - ${debugId} - ${statusCode} - ${JSON.stringify(body)}`);
      reqIdsMap[debugId] = null;
      break;
  }
});
