/*
* @Author: lizhonghui
* @Date:   2017-01-10 16:21:25
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-02-09 23:53:30
*/

const innerConfig = require('../config/inner');
const codeMark = innerConfig.codeMark;
const msgMark = innerConfig.msgMark;

module.exports = {
  UnknownError: { [codeMark]: 11, [msgMark]: 'System error. Please try again later' }, 
  ParamMissing: { [codeMark]: 12, [msgMark]: 'Missing parameters' },
  ParamError: { [codeMark]: 13, [msgMark]: 'Parameters error' }, 
  InterfError: { [codeMark]: 14, [msgMark]: 'Internal interface error. Please try again later' },
  EmptyError: { [codeMark]: 15, [msgMark]: 'Internal interface error. Please try again later' }, 
  DataError: { [codeMark]: 16, [msgMark]: 'unexpected internal interface data ' }, 
}