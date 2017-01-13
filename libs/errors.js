/*
* @Author: lizhonghui
* @Date:   2017-01-10 16:21:25
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-10 16:22:00
*/

module.exports = {
  UnknownError: { code: 11, msg: '系统错误，请稍候重试' },
  ParamMissing: { code: 12, msg: '缺少传入参数' },
  ParamError: { code: 13, msg: '传入参数错误' },
  InterfError: { code: 14, msg: '内部接口错误，请稍候重试' },
  EmptyError: { code: 15, msg: '内部接口错误，请稍候重试' },
  DataError: { code: 16, msg: '内部接口数据有误' }, // 有数据，但与预期不同
}