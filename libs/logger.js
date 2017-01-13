/*
* @Author: lizhonghui
* @Date:   2017-01-11 10:31:17
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-12 15:55:35
*/

let tracer = require('tracer');
let config = require('../config');
let logger = tracer.console({
  level: config.level,
  format: '{{timestamp}} <{{title}}> {{file}}(#{{line}}): {{message}}'
})
module.exports = logger;
