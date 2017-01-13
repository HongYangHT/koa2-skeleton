/*
* @Author: lizhonghui
* @Date:   2017-01-11 09:36:46
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-13 15:33:46
*/

module.exports = router => {
	router.get('/', async ctx => {
    let data = { product: 'business' }
		ctx.body = await ctx.render('business/page', data);
	})
}
