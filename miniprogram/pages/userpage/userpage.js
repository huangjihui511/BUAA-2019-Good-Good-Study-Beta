// miniprogram/pages/userpage/userpage.js
const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
      },
    ],
    headImageNum: 1,
    uploaderName: "开发者",
    TopIndex: 0,
    uploader:[],
    collection: [],
    have_shop_collection:[],
    no_shop_collection:[],
    do_interest:"",
    upload:0,
    upload_name:"",
    upload_word:"他/她还没有格言哦~",
    //上传者收藏
    collection1:[],
    //上传者自制
    collection2:[],
    interest:0,
    be_interested:0,
    userExp:0,
    user_rank:0,
    rankExp:[0,5,15,30,50,100,200,500,1000,2000,3000,6000,10000,18000,30000,60000,
      100000,300000],
  },
  interest_or_no(){
    var _this=this
    if(this.data.do_interest=="+关注"){
      wx.cloud.callFunction({
        name: "get_label",
        data:{
          id:app.globalData.open_id
        },
        success(res){
          console.log(res)
          console.log("999",res.result.data[0].expression_set)
          console.log("999",app.globalData.userInfo)
          wx.cloud.callFunction({
            name: "change_interest",
            data:{
              id:app.globalData.open_id,
              flag:true,
              interest:_this.data.upload,
              name:_this.data.upload_name,
              my_name:app.globalData.userInfo.nickName,
            },
            success(res){ 
              _this.setData({
                do_interest:"取消关注"
              })
              console.log(res)
            }
          })
        }
      })
    }
    else{
      wx.cloud.callFunction({
        name: "change_interest",
        data:{
          id:app.globalData.open_id,
          flag:false,
          interest:_this.data.upload
        },
        success(res){
          _this.setData({
            do_interest:"+关注"
          })
          console.log(res)
        }
      })
    }
  },

  interest_list(){
    wx.navigateTo({
      url: '../../pages/team2/interest/index?judge='+1+'&open_id='+this.data.upload
    })
  },

  jump_to_more:function(e) {
    var that = this
    var index = e.currentTarget.dataset.id
    if (index == 0) {
      var tempList = []
      for (var i = 0;i < this.data.have_shop_collection.length;i++) {
        tempList.push(this.data.have_shop_collection[i]['file_id'])
      }
      app.globalData.userList = tempList
    }
    else {
      var tempList = []
      for (var i = 0;i < this.data.no_shop_collection.length;i++) {
        tempList.push(this.data.no_shop_collection[i]['file_id'])
      }
      app.globalData.userList = tempList
    }
    
    //console.log(that.data.userUploadList)
    wx.navigateTo({
      url: '/pages/moreUserImages/moreUserImages?id='+
      that.data.upload+'&name='+
      that.data.upload_name
    })
  },

  jumpToExp:function(e) {
    wx.navigateTo({
      url: '../../pages/aboutExp/aboutExp'
    })
  },

  calUserRank: function() {
    //根据用户的经验计算等级
    var exp = this.data.userExp
    wx.cloud.callFunction({
      name:'add_expression',
      data:{
        request:'user_exp',
        data1:exp
      }
    }).then(res=>{
      console.log("testfunctionExp:",res.result)
    })
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
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    this.setData({
      upload:options.upload
    })
    this.setData({
      upload_name:options.name
    })
    console.log("111"+this.data.upload_name)
  
    wx.cloud.callFunction({
      name: "get_label",
      data:{
        id:app.globalData.open_id
      },
      success(res){
        console.log(res)
        if(res.result.data[0].interest!=undefined){
          var i
          _this.setData({
            do_interest:"+关注"
          })
          for(i=0;i<res.result.data[0].interest.length;i++){
            if(res.result.data[0].interest[i].open_id==options.upload){
              _this.setData({
                do_interest:"取消关注"
              })
              break
            }
          }
        }
        wx.cloud.callFunction({
          name: "get_label",
          data:{
            id:_this.data.upload
          },
          success:function(res) {
            _this.data.userExp = res.result.data[0].exp

            _this.calUserRank()

            if(res.result.data[0].interest!=undefined){
              _this.setData({
                interest:res.result.data[0].interest.length
              })
            }
            if(res.result.data[0].be_interested!=undefined){
              _this.setData({
                be_interested:res.result.data[0].be_interested.length
              })
            }
          }
        })
      }
    })
    console.log(options)
    if (options.upload == ""){
      console.log("noUploader")
      wx.showToast({
        title: '此表情由开发者上传',
        icon: 'none',
        duration: 3000//持续的时间
      })
    }
    else {
      db.collection('user').where({
        open_id: options.upload
      }).get().then(res=>{
        if (res.data.length == 0) {
          wx.showToast({
            title: '此表情由开发者上传',
            icon: 'none',
            duration: 3000//持续的时间
          })
        }
        else {
        console.log(res)
        var temp=res.data[0].expression_set
        var no_shop_public_expressions=[]
        var public_expressions=[]
        var i,j,k,h
        k=0
        h=0
        console.log(temp)
        for(i=0;i<temp.length;i++){
          if(temp[i].tags!=undefined){
            for(j=0;j<temp[i].tags.length;j++){
              if(temp[i].tags[j].name=="未公开"){
                break
              }
            }
            if(j==temp[i].tags.length){
              if((temp[i].tags.length==2)&&(temp[i].tags[1].name=="商店")){}
              else{
                no_shop_public_expressions[k]=temp[i]
                k++
              }
              public_expressions[h]=temp[i]
              h++
            }
          }
        }
        console.log(res)
        this.setData({
          uploader: res.data,
          collection: public_expressions,
          have_shop_collection:public_expressions,
          no_shop_collection:no_shop_public_expressions,
          uploaderName: res.data[0].user_name
        })
        var tempC1 = [],tempC2 = []
        for (var i = 0;i < this.data.have_shop_collection.length;i++) {
          tempC1.push(this.data.have_shop_collection[i])
          if (i == 8) {
            break
          }
        }
        for (var j = 0;j < this.data.no_shop_collection.length;j++) {
          tempC2.push(this.data.no_shop_collection[j])
          if (j == 8) {
            break
          }
        }
        this.data.collection1 = tempC1
        this.setData({
          collection1:this.data.collection1
        })
        this.data.collection2 = tempC2
        this.setData({
          collection2:this.data.collection2
        })
        console.log(this.data.uploader)
        console.log(this.data.collection)
        console.log(this.data.have_shop_collection)
        console.log(this.data.no_shop_collection)
        }
      })
    }
    this.setData({
      headImageNum: Math.floor(Math.random()*3) + 1
    })
    console.log(this.data.headImageNum)
  },

  changestyle:function(e){
    let index=e.currentTarget.dataset.id;
    let _this=this
    if(index==0){
      this.setData({
        collection:_this.data.have_shop_collection
      })
    }
    else{
      this.setData({
        collection:_this.data.no_shop_collection
      })
    }
    this.setData({
      TopIndex:index
    })
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
    let index=e.currentTarget.dataset.id;
    let _this=this
    //上传者收藏
    if(index==0){
      this.setData({
        collection:_this.data.have_shop_collection
      })
    }
    //上传者自制
    else{
      this.setData({
        collection:_this.data.no_shop_collection
      })
    }
    this.setData({
      TopIndex:index
    })
  },

  /*shop_image_pagejump:function(e) {
    var app = getApp()
    console.log(e)
    // app.globalData.data = {'imagepath':imagepath}
    wx.navigateTo({
      url: '/pages/index/index?url='+ e.currentTarget.dataset.fileid
    })
  },*/

  shop_image_pagejump:function(e) {
    var app = getApp()
    console.log(e)
    var fileid = e.currentTarget.dataset.fileid
    var tag = e.currentTarget.dataset.tag
    var ifNoSimilar = e.currentTarget.dataset.judge
    app.globalData.shopImageTag = tag
    console.log("app shopTag:",app.globalData.shopImageTag)
    console.log("tag:",tag)
    console.log("ifNosimilar(judge):",ifNoSimilar)
    var visits = 0
    var _id = ''
    // app.globalData.data = {'imagepath':imagepath}
    if (ifNoSimilar == 1) {
      app.globalData.similarExpression = 0
      console.log("不显示相似表情:",app.globalData.similarExpression)
    }
    else if (ifNoSimilar == 2){
      app.globalData.similarExpression = 2
    }
    else {
      app.globalData.similarExpression = 1
    }
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