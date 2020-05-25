//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
//var path = require('app.js')
Page({
  data: {
    like_number: 0,
    user_rank: 0,
    rankExp:[0,5,15,30,50,100,200,500,1000,2000,3000,6000,10000,18000,30000,60000,
      100000,300000],
    icon: [{ name: 'favorfill', isShow: true , text: '收藏', action: 'storeImage'}, { name: 'check', isShow: true, text: '下载', action: 'download'}, { name: 'appreciate', isShow: true, text: '点赞0次', action: 'like'},  { name: 'emoji', isShow: true, text: '了解上传者收藏', action: 'jump2my_userpage'},],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    imagePath: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    uploaduser: '',
    uploaduser_name:"",
    //gzh similar expressions
    showPicList: [
      [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
      [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
      [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
      [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
      [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
      [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
    ],
    //tag of these expressions
    tag_image:'',
    //vars used to search similar expressions onload
    globalShowIndex:0,
    showListCache:[],
    comment:[],
    my_comment:[],
    my_name:"",
    time:"",
    expression:"",
    info:"",
    download_times: 0,
    headImage_index:[],
    headImage: [
      {
        url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/animal1.png',
      },
      {
        url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/animal2.png'
      },
      {
        url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/animal3.png'
      },
      {
        url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/animal4.png'
      }],
  },

  like(){
    var _this=this
    let name="icon[2].text"
    _this.setData({
      like_number:_this.data.like_number+1
    })
    _this.setData({
      [name]:"点赞"+_this.data.like_number+"次"
    })
    wx.showToast({
      title: '点赞成功',
      icon: 'success',
      duration: 1000
    })
    wx.cloud.callFunction({
      name: "add_like_or_favor",
      data:{
        src:_this.data.expression,
        flag:"like"
      },
      success(res){
        console.log(res)
      }
    })
  },

  getinput(e){
    this.data.my_comment=e.detail.value
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  commented(){
    this.setData({
      info:""
    })
    wx.showToast({
      title: '评论中',
      icon: 'loading',
      duration: 100000
    })
    var _this=this
    console.log("评论",_this.data.my_comment)
    wx.cloud.callFunction({
      name:'get_exp',
      data: {
        id:app.globalData.open_id
      },
      success(res){
        console.log("666666",res)
        _this.setData({
          my_name:res.result.data[0].user_name
        })
        var temp
        var myDate=new Date()
        let fullYear = (myDate.getFullYear()).toString();
        let month = (myDate.getMonth()+1).toString();
        let day = (myDate.getDate()).toString();
        let hour = (myDate.getHours()).toString();
        let minute = (myDate.getMinutes()).toString();
        let second = (myDate.getSeconds()).toString();
        temp=fullYear+"-"+month+"-"+day+" "+hour+":"+minute+":"+second
        _this.setData({
          time:temp
        })
        console.log(_this.data.time)
        wx.cloud.callFunction({
          name: 'add_comment',
          data: {
            src:_this.data.expression,
            comment:{"open_id":app.globalData.open_id,"user_name":res.result.data[0].user_name,"comment":_this.data.my_comment,"time":_this.data.time}
          },
          success(res){
            console.log(res)
            
            let temp="headImage_index["+_this.data.headImage_index.length+"]"
            _this.setData({
              [temp]: Math.floor(Math.random()*3) + 1
            })
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 1000,
          success(res){
            let temp
            if(_this.data.comment==undefined){
              temp="comment[0]"
            }
            else{
              temp="comment["+_this.data.comment.length+"]"
            }
            _this.setData({
              [temp]:{"open_id":app.globalData.open_id,"user_name":_this.data.my_name,"comment":_this.data.my_comment,"time":_this.data.time}
            })
          }
        })
          },
          fail(res){
            console.log("错误"+res)
          }
        })
      }
    })
  },

  /*commented(){
    wx.showToast({
      title: '评论中',
      icon: 'loading',
      duration: 100000
    })
    console.log("评论",this.data.comment)
    wx.cloud.callFunction({
      name:'get_exp',
      data: {
        id:app.globalData.open_id
      },
      success(res){
        console.log("666666",res)
        wx.cloud.callFunction({
          name: 'add_comment',
          data: {
            src:this.data.expression,
            comment:{"open_id":app.globalData.open_id,"user_name":res.result.data[0].user_name,"comment":this.data.comment,"time":new Date()}
          },
          success(res){
            console.log(res)
            
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 1000,
          success(res){
            wx.redirectTo({
              url: '../expression_information/index?expression='+this.data.expression,
            })
          }
        })
          },
          fail(res){
            console.log("错误"+res)
          }
        })
      }
    })
    
  },*/
  
  appreciate:function(){
    wx.showToast({
      title: '您已点赞',
      icon: 'success',
      duration: 3000
    })
  },

//定义监听回调方法
//app 监听回调方法
  watchBack: value=> { //这里的value 就是 app.js 中 watch 方法中的 set, 返回整个 globalData
    this.setData({
      imagePath : value.imagePath
    });
  },

  //点击图片
  shop_image_pagejump:function(e) {
    var app = getApp()
    console.log(e)
    var fileid = e.currentTarget.dataset.fileid
    var tag = e.currentTarget.dataset.tag
    app.globalData.shopImageTag = tag
    console.log("tag:",app.globalData.shopImageTag)
    console.log("test_cloud")
    wx.cloud.callFunction({
      name:'image_visit_times',
      data:{
       id:fileid,
       tag:tag
      }
    }).then(res=>{
      console.log("call_cloud_success")
    })

    // app.globalData.data = {'imagepath':imagepath}
    wx.navigateTo({
      url: '/pages/index/index?url='+ e.currentTarget.dataset.fileid
    })
  },

  //搜索图片
  searchOnload: function() {

    console.log("searchOnload")
    var v = this.data.tag_image
    console.log("onload similar tag:",v)

    let that = this
    this.data.globalShowIndex = 0
    this.data.showListCache = []

    for (var i = 0;i < 5;i++) {
      for (var j = 0;j < 3;j++) {
        this.data.showPicList[i][j]['file_id'] = ''
        this.setData({
          showPicList:this.data.showPicList
        })
      }
    }
    //console.log("showPicList:",this.data.showPicList)

    //暂存所有查找的图片路径
    var tempPaths = []
    
    var labels=['label7']
    labels[0] = v
    var globalPicIndex = 0
    wx.cloud.init()
    //索引方式
    var judge = 3
    //for (var i = 0;i < labels.length;i++) {
      //var label = labels[i]
    for (var i = 0;i < 1;i++) {  
      var label = labels[i]
        if (judge == 3) {
          db.collection("tag_names").get({
            success:function(res) {
              wx.showLoading({
                title: '加载中',
               })
               setTimeout(function () {
                wx.hideLoading()
                if (globalPicIndex == 0){
                  console.log("未找到：",globalPicIndex)
                  wx.showToast({
                  title: '抱歉，未找到您想要的表情，换个关键词试试^_^?', // 标题
                  icon: 'none',  // 图标类型，none
                  duration: 2500  // 提示窗停留时间，默认1500ms
                })
                }
                }, 20000)
              var all_tags = res.data[0].name
              //console.log("all_tags:",all_tags)
              for (var runover = 0;runover < all_tags.length;runover++) {
                var judge = 0 
                var inputString = String(label)
                var tag = all_tags[runover]
                var labelString = String(tag)
                //console.log(inputString,"---",labelString,"是否匹配:",inputString.indexOf(labelString))
                if (inputString.indexOf(labelString) >= 0) {
                  judge = 1
                }
                if (judge == 1) {
                  //console.log("匹配成功")
                  var path
                  db.collection("tags").where({
                    name:tag
                  }).get({
                    success:function(res) {
                      var datas = res.data
                      for (var f = 0;f < datas.length;f++) {
                        var ids = datas[f]['expression_id']
                        //console.log("ids:",ids) 
                        for (var key in ids) {
                          var reflex1 = globalPicIndex%18
                            var reflex2 =  parseInt(reflex1/3)
                            var reflex3 = reflex1%3
                          //  console.log("globalPicIndex:",globalPicIndex)
                          //  console.log("key:",key)
                          that.data.showListCache[globalPicIndex] = ids[key]
                          if (globalPicIndex < 18) {
                            that.data.showPicList[reflex2][reflex3]['file_id'] = ids[key]
                            that.data.showPicList[reflex2][reflex3]['tag'] = tag
                            that.setData({
                              showPicList:that.data.showPicList
                            }) 
                          }
                          globalPicIndex++
                      }
                    }
                    var fill = globalPicIndex
                    if (fill < 18) {
                      for (;fill < 18;fill++) {
                        that.data.showPicList[parseInt(fill/3)][fill%3]['file_id'] = ''
                        that.setData({
                          showPicList:that.data.showPicList
                        })
                      }
                    }
                    }
                  })
                  // 数据加载完成，隐藏弹窗
                  wx.hideLoading()
                  break;
                }
                if (runover == all_tags.length) {
                  // 数据加载完成，隐藏弹窗
                  console.log("结束")
                }
                if ((runover == all_tags.length) && (globalPicIndex == 0)) {
                  // 数据加载完成，隐藏弹窗
                }
                if ((runover == all_tags.length) && (globalPicIndex > 0)) {
                  // 数据加载完成，隐藏弹窗
                }
                if (globalPicIndex >= 9) {
                  // 数据加载完成，隐藏弹窗
                  break
                }
              } 
            }
          })
        }
      }
  },
  
  onLoad: function (option) {
    var app = getApp()
    var _this=this
    var tag = app.globalData.shopImageTag
    this.data.tag_image = tag
    console.log("tag_onload:",this.data.tag_image) 
    //console.log("paths:",this.data.showListCache)
    this.data.ifLoadSimilar = app.globalData.similarExpression
    console.log("ifLoadSimilar:",this.data.ifLoadSimilar)
    this.setData({
      ifLoadSimilar:this.data.ifLoadSimilar
    })
    if (this.data.ifLoadSimilar == 1) {
      this.searchOnload()
    }
    console.log(option)
    this.setData({
      imagePath: option.url
    })
    this.data.expression = option.url
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    db.collection('expression').where({
      file_id: this.data.imagePath
    }).get().then(res=>{
      if (res.data.length == 0){

      }
      else {
        this.setData({
          uploaduser: res.data[0].open_id
        })
        wx.cloud.callFunction({
          name:"get_label",
          data:{
            id:res.data[0].open_id,
          },
          success(res){
            console.log("4855",res)
            if((res.result.data[0]==undefined)||(res.result.data[0].user_name==undefined)){
              _this.setData({
                uploaduser_name:""
              })
            }
            else{
              _this.setData({
                uploaduser_name:res.result.data[0].user_name
              })
            }
          }
        })
      }
      console.log(this.data.uploaduser)
    })

    wx.cloud.callFunction({
      name:"get_expression",
      data:{
        data1:option.url
      },
      success(res){
        if(res.result.data[0].comment!=undefined){
          _this.setData({
            comment:res.result.data[0].comment
          })
          var k
          for(k=0;k<res.result.data[0].comment.length;k++){
            let temp="headImage_index["+k+"]"
            _this.setData({
              [temp]: Math.floor(Math.random()*3) + 1
            })
          }
          console.log(_this.data.headImage_index)
        }
        else{
          _this.setData({
            comment:[]
          })
        }
        console.log("1111",_this.data.comment)
        if(res.result.data[0].like!=undefined){
          let name="icon[2].text"
          _this.setData({
            [name]:"点赞"+res.result.data[0].like+"次",
            like_number:res.result.data[0].like
          })
        }
      }
    })
    console.log(app.globalData.open_id)
    db.collection('user').where({
      open_id: app.globalData.open_id,
    }).get({
      success: function(res){
        console.log(res)
        _this.getUserRank(res.data[0].exp)
      },
      fail:console.error
    })
  },

  getUserRank(exp) {
    console.log(exp)
    
    var expList = this.data.rankExp
    var upbound
    var i = 0
    for (;i < 17;i++) {
      if ((exp >= expList[i]) && (exp < expList[i+1])) {
        upbound = expList[i+1]
        break
      }
    }
    if (i == 17) {
      upbound = expList[17]
    }
    this.setData({
      user_rank: i+1,
      user_exp_Upbound: upbound
    })
    console.log("rank:"+this.data.user_rank)
    if(this.data.user_rank != app.globalData.user_rank){
      app.globalData.user_rank = this.data.user_rank
    }
  },


  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //下载图片
  download(e) {
    console.log(app.globalData.user_rank)
    if (app.globalData.user_rank > app.globalData.user_download){
      app.globalData.user_download += 1
      console.log("you can download!")
      let fileUrl = this.data.imagePath
      console.log(fileUrl)
      wx.cloud.downloadFile({
        fileID: fileUrl,
        success: res => {
          console.log('下载成功', res)
          this.saveImage(res.tempFilePath)
          this.setData({
            download_times: this.data.download_times+1,
          })
        },
        fail: res => {
          console.log('下载失败', res)
        }
      })
      console.log(app.globalData.user_download)
    }
    else {
      wx.showModal({
        title: '提示',
        content: '您已达到该等级后今日下载上限。'
      })
    }
  },
  // 保存图片到相册
  saveImage(imgUrl){
        wx.saveImageToPhotosAlbum({
          filePath: imgUrl,
          success:function (data) {
            console.log(data);
            wx.showToast({
              title: '下载成功',
              icon: 'success',
              duration: 3000
            })
          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success:modalSuccess=>{
                  wx.openSetting({
                    success(settingdata) {
                      console.log("settingdata", settingdata)
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击下载即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                    fail(failData) {
                      console.log("failData",failData)
                    },
                    complete(finishData) {
                      console.log("finishData", finishData)
                    }
                  })
                }
              })
            }
          },



          
        })
  },
  //收藏图片
  storeImage(e){
    var _this=this
    const _ = db.command
    var temp_image = {
      file_id: e.currentTarget.dataset.fileid
    }
    var user_openid = app.globalData.open_id
    console.log(app.globalData.open_id)
    console.log(this.data.imagePath)
    var util = require('../../utils/util.js'); 
    var TIME = util.formatTime(new Date());
    wx.cloud.callFunction({
      name: 'add_expression',
      /*data:{
        request: 'add_picture',
        data1: TIME,
        data2: app.globalData.open_id,
        data4: this.data.imagePath,
        data5: true
      },*/
      data: {
        request: 'add_expression',
        data1: app.globalData.open_id,
        data2: _this.data.imagePath,
        data3:[{"name":_this.data.tag_image,"num":0},{"name":"商店","num":0}]
      },
    }).then(res=> {
      wx.showToast({                
        title: '收藏成功',                
        icon: 'success',                
        duration: 1500,                
        mask: false,             
      })
    })
    /*db.collection('user').where({
      open_id: user_openid
    }).update({
      data:{
        expression_set: _.push(temp_image)
      }
    }).then(res=>{
      console.log(res.data)
      wx.showToast({                
        title: '收藏成功',                
        icon: 'success',                
        duration: 1500,                
        mask: false,             
      })
     })*/
     wx.cloud.callFunction({
      name: "add_like_or_favor",
      data:{
        src:_this.data.imagePath,
        flag:"favor"
      },
      success(res){
        console.log(res)
      }
    })
  },
  jump2my_userpage:function(e) {
    var app = getApp()
    console.log(e)
    // app.globalData.data = {'imagepath':imagepath}
    console.log("uploaduser:",this.data.uploaduser)
    console.log("uploadusername:",this.data.uploaduser_name)
    wx.navigateTo({
      url: '/pages/userpage/userpage?upload='+this.data.uploaduser+'&name='+this.data.uploaduser_name
    })
  },
  jump2userpage:function(e) {
    var app = getApp()
    console.log(e)
    // app.globalData.data = {'imagepath':imagepath}
    wx.navigateTo({
      url: '/pages/userpage/userpage?upload='+e.currentTarget.dataset.id.open_id+'&name='+e.currentTarget.dataset.id.user_name
    })
  },
})
