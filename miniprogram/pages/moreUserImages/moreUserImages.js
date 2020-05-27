// miniprogram/pages/moreUserImages/moreUserImages.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    userId:'',
    userList:[],
    //头像
    headImage: [{ url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/animal1.png',},
      {url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/animal2.png' },
      {url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/animal3.png'},
      {url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/animal4.png'}],
    headImage_index:0,
  },

  jump2userpage:function(e) {
    var app = getApp()
    console.log(e)
    // app.globalData.data = {'imagepath':imagepath}
    var uploaduser = e.currentTarget.dataset.uploaduser
    var uploadusername = e.currentTarget.dataset.uploadusername
    console.log("uploaduser:",uploaduser)
    console.log("uploadusername:",uploadusername)
    wx.navigateTo({
      url: '/pages/userpage/userpage?upload='+uploaduser+'&name='+uploadusername
    })
  },

  shop_image_pagejump:function(e) {
    var app = getApp()
    console.log(e)
    var fileid = e.currentTarget.dataset.fileid
    var tag = e.currentTarget.dataset.tag
    var ifNoSimilar = e.currentTarget.dataset.judge
    app.globalData.shopImageTag = tag
    console.log("app shopTag:",app.globalData.shopImageTag)
    console.log("tag:",tag)
    var visits = 0
    var _id = ''
    if (ifNoSimilar != 1) {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options:",options)
    this.data.userName = options.name
    this.setData({
      userName:this.data.userName
    })
    this.data.userId = options.id
    this.setData({
      userId:this.data.userId
    })
    this.data.userList = app.globalData.userList
    console.log("appUserList:",this.data.userList)
    this.setData({
      userList:this.data.userList
    })
    wx.setNavigationBarTitle({
      title: this.data.userName+"的自制表情"
    })
    this.data.headImage_index = Math.floor(Math.random()*3) + 1
    this.setData({
      headImage_index:this.data.headImage_index
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