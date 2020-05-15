// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const countResult = await db.collection('expression_visit_times').count()
  const total = countResult.total
      // 计算需分几次取
  const batchTimes = Math.ceil(total / 20)
  
  const fileid = event.id
  console.log("batchtimes:",batchTimes)
  console.log("fileid:",fileid)
  for (var i = 0;i < batchTimes;i++) {
    console.log("i:",i)
    var isnull = 0
    var res = await db.collection("expression_visit_times").where({
      id:fileid
    }).skip(i*20).get()
    console.log("res.data:",res)         
    if ((res.data[0] == null) && (i == batchTimes-1)) {
      await db.collection('expression_visit_times').add({
      // data 字段表示需新增的 JSON 数据
      data: {
                // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        id:fileid,
        times:1
      }
      }).then(res=>{
        console.log("第一次访问表情")
        console.log(res)
      })
    }
    else {
            visits = res.data[0].times
            console.log("visits:",res.data[0].times)
            console.log("visits2:",visits)
            visits++
            _id = res.data[0]._id
            console.log("_id:",_id)

            try{
            //为什么where子句加set不可以？
            await db.collection('expression_visit_times').doc(_id).set({
              data:{
                id:fileid,
                times:visits
              }
            }).then(res=>{
              console.log("跟新成功")
            })}catch(e) {
            console.log(e)
          }
    }
  }
  

  /*return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }*/
}