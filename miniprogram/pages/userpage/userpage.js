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
    collection: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        console.log(res)
        this.setData({
          uploader: res.data,
          collection: res.data[0].expression_set,
          uploaderName: res.data[0].name
        })
        console.log(this.data.uploader)
        console.log(this.data.collection)
      })
    }
    this.setData({
      headImageNum: Math.floor(Math.random()*3) + 1
    })
    console.log(this.data.headImageNum)
  },

  changestyle:function(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
      TopIndex:index
    })
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },

  shop_image_pagejump:function(e) {
    var app = getApp()
    console.log(e)
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