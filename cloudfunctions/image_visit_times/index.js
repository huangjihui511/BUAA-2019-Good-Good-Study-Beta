// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const request = event.request

  //查找推荐表情
  if (request == 1) {
    const countResult = await db.collection('expression_visit_times').count()
    const total = countResult.total
      // 计算需分几次取
    var batchTimes = Math.ceil(total / 20)
    if (batchTimes==0) {
      batchTimes = 1
    }
    console.log("request=1:",batchTimes)
    var resultArray = []
    for (var i = 0;i < batchTimes;i++) {
      var temp = await db.collection("expression_visit_times").skip(i*100).get()
      console.log("第"+i+"次取,结果为:",temp)
      console.log("temp.data:",temp.data)
      resultArray = resultArray.concat(temp.data)
      /*await db.collection("expression_visit_times").skip(i*100).get({
        success:function(res) {
          console.log("第"+i+"次取,结果为:")
          console.log(res)
          resultArray.concat(res.data)
        }
      })*/ 
    }
    console.log("resultArray:",resultArray)
    return {
      data:resultArray
    }
  }

  const countResult = await db.collection('expression_visit_times').count()
  const total = countResult.total
      // 计算需分几次取
  var batchTimes = Math.ceil(total / 20)
  const filetag = event.tag 
  const fileid = event.id
  
  if (batchTimes==0) {
    batchTimes = 1
  }
  console.log("batchtimes:",batchTimes)
  console.log("fileid:",fileid)
  console.log("filetag:",filetag)
  for (var i = 0;i < batchTimes;i++) {
    console.log("i:",i)
    var isnull = 0
    var res = await db.collection("expression_visit_times").where({
      id:fileid
    }).skip(i*100).get()
    console.log("res.data:",res)         
    if ((res.data[0] == null) && (i == batchTimes-1)) {
      await db.collection('expression_visit_times').add({
      // data 字段表示需新增的 JSON 数据
      data: {
                // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        id:fileid,
        tag:filetag,
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
                tag:filetag,
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