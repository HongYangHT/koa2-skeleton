/*
* @Author: lizhonghui
* @Date:   2017-03-27 21:35:33
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-03-27 21:55:52
*/

'use strict';

const counterModel = require('../models/counter');
// other model

async function makeOrder(ctx, data) {
  return await counterModel.request(ctx, {
    method: "POST",
    body: data
  });
}

async function getOrders(ctx, query) {
  return await counterModel.request(ctx, {
    method: "GET",
    qs: query
  });
}

module.exports = {
  makeOrder, getOrders
}
