// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"project-database-v58ji"
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //const wxContext = cloud.getWXContext()
  var expression_id = event.data1
  try{
    return [await db.collection('expression').where({
      file_id:expression_id
    }).get(),event.data2]
  } catch(e){
    console.log(e)
  }
}