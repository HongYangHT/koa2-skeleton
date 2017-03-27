/*
* @Author: lizhonghui
* @Date:   2017-01-10 17:01:31
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-03-27 21:58:09
*/

const Joi = require('joi');
const dealService = require('../../services/deal');

module.exports = router => {
  router.get('/', async ctx => {
    let query = Joi.validateThrow(ctx.query, {
      pageNum: Joi.number().integer().min(1).default(1),
      pageSize: Joi.number().integer().min(1).max(100).default(10),
      // type: Joi.string().required()
    });
    ctx.resBody = await dealService.getOrders(ctx, query);
  })

  router.get('/makeorder', async ctx => {
    let data = Joi.validateThrow(ctx.request.body, {
      // ...
    });
    ctx.resBody = await dealService.makeOrder(ctx, data);
  })
}
