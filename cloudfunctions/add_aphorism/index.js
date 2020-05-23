// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  return await db.collection('user').where({
    open_id:event.open_id
  })
  .update({
    data: {
      aphorism: event.aphorism
    }
  })
}