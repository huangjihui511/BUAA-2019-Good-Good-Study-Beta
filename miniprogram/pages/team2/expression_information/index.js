// pages/team2/expression_information/index.js
var app=getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    like_number:0,
    favor_number:0,
    info:"",
    tag_image:'',
    showPicList: [
      [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
      [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
      [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
      [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
      [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
      [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
    ],
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
    expression:'',
    icon: [{ name: 'appreciate', isShow: true,chinese_name:"转发",bind:'forward'}, { name: 'check', isShow: true ,chinese_name:'保存到手机',bind:'save'}, { name: 'close', isShow: false }, { name: 'edit', isShow: true ,chinese_name:'编辑图片',bind:"edit"}, { name: 'emoji', isShow: true ,chinese_name:"修改标签",bind:"change_label"}, { name: 'favorfill', isShow: false }, { name: 'favor', isShow: true ,chinese_name:'收藏到微信',bind:"collect"},{ name: 'favor', isShow: true ,chinese_name:'',bind:"public_picture"},{ name: 'appreciate', isShow: true,chinese_name:"点赞",bind:'like'},{ name: 'favorfill', isShow: true,chinese_name:"已收藏"}],
    comment:[],
    my_comment:[],    
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    imagePath: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    uploaduser: '',
    globalShowIndex:0,
    showListCache:[],
    my_name:"",
    time:""
  },
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
  like(){
    var _this=this
    let name="icon[8].chinese_name"
    _this.setData({
      like_number:_this.data.like_number+1
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
  public_picture(){
    var _this=this
    if(this.data.icon[7].chinese_name=="公开"){
      setTimeout(function () {wx.showToast({
        title: '已加经验',
        icon: 'success',
        duration: 1000
      })},1000)
      wx.cloud.callFunction({
        name: "add_exp",
        data:{
          id:app.globalData.open_id,
          incNum:10
        }
      })
      wx.cloud.callFunction({
        name:'change_picture_public',
        data: {
          src:_this.data.expression,
          do_public:true,
          cur_name:"未公开",
          change_name:"公开",
          open_id:app.globalData.open_id
        },
        success(res){
          let name="icon[7].chinese_name"
          _this.setData({
            [name]:"取消公开"
          }) 
          console.log(res)
        }
      })
    }
    else if(this.data.icon[7].chinese_name=="取消公开"){
      wx.cloud.callFunction({
        name: "add_exp",
        data:{
          id:app.globalData.open_id,
          incNum:-10
        }
      })
      wx.cloud.callFunction({
        name:'change_picture_public',
        data: {
          src:_this.data.expression,
          cur_name:"公开",
          change_name:"未公开",
          do_public:false,
          open_id:app.globalData.open_id
        },
        success(res){
          let name="icon[7].chinese_name"
          _this.setData({
            [name]:"公开"
          }) 
          console.log(res)
        }
      })
    }
  },
  look_public(){
    var _this=this
    wx.cloud.callFunction({
      name:'get_user_exp_tag',
      data: {
        data1:app.globalData.open_id,
        data2:_this.data.expression
      },
      success(res){
        var i
        var temp
        console.log("11111111",res)
        for(i=0;i<res.result.data[0].expression_set.length;i++){
          if(res.result.data[0].expression_set[i].file_id==_this.data.expression){
            temp=res.result.data[0].expression_set[i]
            break
          }
        }
        console.log(temp)
        if(temp.tags!=undefined){
          let name="icon[7].chinese_name"
          for(i=0;i<temp.tags.length;i++){
            if(temp.tags[i].name=="商店"){
              _this.setData({
                [name]:"来源：商店"
              })
              break
            }
            else if(temp.tags[i].name=="未公开"){
              _this.setData({
                [name]:"公开"
              })
              break
            }
          }
          if(i==temp.tags.length){
            _this.setData({
              [name]:"取消公开"
            })
          }
        }
      }
    })
  },
  jump2userpage:function(e) {
    var app = getApp()
    console.log(e.currentTarget.dataset.id.open_id)
    // app.globalData.data = {'imagepath':imagepath}
    wx.navigateTo({
      url: '/pages/userpage/userpage?upload='+e.currentTarget.dataset.id.open_id+'&name='+e.currentTarget.dataset.id.user_name
    })
  },
  getinput(e){
    this.data.my_comment=e.detail.value
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
            let temp="comment["+_this.data.comment.length+"]"
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
  forward(){
    wx.showToast({
      title: '长按图片可转发',
      icon: 'loading',
      duration: 1000
    })
    this.previewImage()
  },
  save(){
    wx.showToast({
      title: '长按图片可保存',
      icon: 'loading',
      duration: 1000
    })
    this.previewImage()
  },
  edit(){
    wx.reLaunch({
      url: '../../edit_functions/edit_functions?src='+this.data.expression,
    })
  },
  change_label(){
    var _this=this
    wx.navigateTo({
      url: '../change_expression_labels/index?src=' +  _this.data.expression,
    })
  },
  collect(){
    wx.showToast({
      title: '长按图片可收藏',
      icon: 'loading',
      duration: 1000
    })
    this.previewImage()
  },
  previewImage: function (e){
    wx.previewImage({
      current: this.data.expression, // 当前显示图片的https链接
      urls: [this.data.expression], // 需要预览的图片https链接列表
    })
  },

  //搜索图片
  searchOnload: function(tag) {

    console.log("searchOnload")
    var v = this.data.tag_image
    //var v = tag
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
                          that.data.showListCache[globalPicIndex] = key
                          if (globalPicIndex < 18) {
                            that.data.showPicList[reflex2][reflex3]['file_id'] = key
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
                  wx.hideLoading()
                  console.log("结束")
                }
                if ((runover == all_tags.length) && (globalPicIndex == 0)) {
                  // 数据加载完成，隐藏弹窗
                  wx.hideLoading()
                }
                if ((runover == all_tags.length) && (globalPicIndex > 0)) {
                  // 数据加载完成，隐藏弹窗
                  wx.hideLoading()
                }
                if (globalPicIndex >= 9) {
                  // 数据加载完成，隐藏弹窗
                  wx.hideLoading()
                  break
                }
              } 
            }
          })
        }
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    console.log("1111",this.options.expression)
    this.setData({
      expression:this.options.expression
    })
    _this.look_public()
    wx.cloud.callFunction({
      name:"get_expression",
      data:{
        data1:_this.options.expression
      },
      success(res){
        console.log("search_result:",res.result.data[0])
        if (res.result.data[0] == undefined) {
          setTimeout(function () {wx.showToast({
            title: '您点击了一张老版本的图片，无法在数据库中找到路径',
            icon: 'none',
            duration: 2000
          })},2000)
        }
        if(res.result.data[0].tags!=undefined) {
          var tags = res.result.data[0].tags
          console.log("tags:",tags)
          var tag
          for (var key in tags) {
            console.log("key:",key)
            tag = key
            if (tag!=undefined) {
              break
            }
          }
          _this.data.tag_image = tag
          if (tag == undefined) {
            setTimeout(function () {wx.showToast({
              title: '您点击了一张老版本的图片，这张图片没有标签',
              icon: 'none',
              duration: 3000
            })},3000)
          }
          console.log("tag:",tag)
          _this.searchOnload(tag)
        }
        if(res.result.data[0].like!=undefined){
          _this.setData({
            like_number:res.result.data[0].like
          })
        }
        if(res.result.data[0].favor!=undefined){
          _this.setData({
            favor_number:res.result.data[0].favor
          })
        }
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
      }
    })
    

    
   /* wx.cloud.callFunction({
      name:'get_expression',
      data: {
        data1:this.options.expression
      },
      success(res){
        var tag = res.result.data[0].tags
        _this.data.tag_image = tag
        console.log("tag_onload:",_this.data.tag_image)
        _this.searchOnload()
    
        console.log(options)
        _this.setData({
          imagePath : options.expression
        })
    
        if (app.globalData.userInfo) {
          _this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
        } else if (_this.data.canIUse){
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
            _this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              _this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          })
        }
    
        db.collection('expression').where({
          file_id: _this.data.imagePath
        }).get().then(res=>{
          _this.setData({
            uploaduser: res.data[0].open_id
          })
          console.log(_this.data.uploaduser)
        })
      }
    })*/
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
                          that.data.showListCache[globalPicIndex] = key
                          if (globalPicIndex < 18) {
                            that.data.showPicList[reflex2][reflex3]['file_id'] = key
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
                  wx.hideLoading()
                  console.log("结束")
                }
                if ((runover == all_tags.length) && (globalPicIndex == 0)) {
                  // 数据加载完成，隐藏弹窗
                  wx.hideLoading()
                }
                if ((runover == all_tags.length) && (globalPicIndex > 0)) {
                  // 数据加载完成，隐藏弹窗
                  wx.hideLoading()
                }
                if (globalPicIndex >= 9) {
                  // 数据加载完成，隐藏弹窗
                  wx.hideLoading()
                  break
                }
              } 
            }
          })
        }
      }
  },

  shop_image_pagejump:function(e) {
    var app = getApp()
    console.log(e)
    var fileid = e.currentTarget.dataset.fileid
    var tag = e.currentTarget.dataset.tag
    app.globalData.shopImageTag = tag
    console.log("app shopTag:",app.globalData.shopImageTag)
    console.log("tag:",tag)
    var visits = 0
    var _id = ''
    var judge = 1
    if (judge == 0) {
    db.collection('expression_visit_times').where({
      id:fileid
    }).get({
        success:function(res) {
          console.log("res.data:",res.data)
          if (res.data[0] == null) {
            db.collection('expression_visit_times').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
                id:e.currentTarget.dataset.fileid,
                tag:tag,
                times:1
              },
              success: function(res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                console.log("第一次访问表情")
                console.log(res)
              }
            })
          }
          else {
            visits = res.data[0].times
            console.log("visits:",res.data[0].times)
            console.log("visits2:",visits)
            visits++
            _id = res.data[0]._id
            console.log("_id:",_id)

            //为什么where子句加set不可以？
            db.collection('expression_visit_times').doc(_id).set({
              data:{
                id:fileid,
                tag:tag,
                times:visits
              },
              success:function(res){
                console.log("再次访问表情")
              },
              fail() {
                console.log("failed")
              }
            })
          }
        }
    })
  }
  else if (judge == 1) {
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
  }
    // app.globalData.data = {'imagepath':imagepath}
    wx.navigateTo({
      url: '/pages/index/index?url='+ e.currentTarget.dataset.fileid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})