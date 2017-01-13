/*
* @Author: lizhonghui
* @Date:   2017-01-11 11:33:49
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-11 15:50:56
*/

const Router = require('lark-router');
let router = new Router();
router.get('/', ctx => ctx.body = 'This is koa2-skeleton!'); // index page
router.load('controllers');
module.exports = router.routes();
