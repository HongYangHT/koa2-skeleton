/*
* @Author: lizhonghui
* @Date:   2017-01-10 17:01:31
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-13 16:53:30
*/

const Joi = require('joi');
const counterModel = require('../../models/counter');

module.exports = router => {
  router.get('/', async ctx => {

    let query = Joi.validateThrow(ctx.query, {
      pageNum: Joi.number().integer().min(1).default(1),
      pageSize: Joi.number().integer().min(1).max(100).default(10),
      // type: Joi.string().required()
    });

    ctx.body = await counterModel.request({
      qs: query
    }, ctx.reqid);

  })
}
