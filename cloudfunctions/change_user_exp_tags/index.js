// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"project-database-v58ji"
})

const db = cloud.database()
const _ = db.command
//传入两个参数 id（用户id），incNum（增加数量）
// 云函数入口函数
exports.main = async (event, context) => {
  var open_id0 = event.data1
    var path = event.data2
    var tag_de = event.data3
    try {
      return await db.collection('user').where({
        open_id:open_id0,
        'expression_set.file_id':path
      }).update({
        data:{
          'expression_set.$.tags':tag_de
        },
      })
    } catch (e) {
      console.log(e)
    }
  
}