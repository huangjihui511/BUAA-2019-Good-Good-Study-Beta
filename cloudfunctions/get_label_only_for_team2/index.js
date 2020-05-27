// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"project-database-v58ji"
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //const wxContext = cloud.getWXContext()
  var id = event.id
  try{
    return [await db.collection('user').where({
      open_id:id
    }).get(),event.index]
  } catch(e){
    console.log(e)
  }
}