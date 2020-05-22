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
  var image_src=event.src
  var public_temp=event.do_public
  var open_id0=event.open_id
  var cur=event.cur_name
  var change=event.change_name
    try {
      await db.collection('expression').where({
        file_id:image_src
      }).update({
        data:{
          public:public_temp
        },
      })
      await db.collection('user').where({
        open_id:open_id0,
        'expression_set.file_id':image_src
      }).update({
        data:{
          'expression_set.$.tags':_.pull({name:cur}),
        },
      })
      await db.collection('user').where({
        open_id:open_id0,
        'expression_set.file_id':image_src
      }).update({
        data:{
          'expression_set.$.tags':_.push({name:change,num:0})
        },
      })
    } catch (e) {
      console.log(e)
    }
  
}