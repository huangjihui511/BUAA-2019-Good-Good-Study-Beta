// miniprogram/pages/hotSearch/hotSearch.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotTagsList:[],
    inputValue:''
  },

  //点击关键词跳转
  hotTagJump:function(e) {
    var tag = e.currentTarget.dataset.tag
    console.log("hotTagJump's tag:",tag)
    this.data.inputValue = tag
    this.confirm()
  },

  confirm: function() {
    var v = this.data.inputValue
    this.setData({toSearch:v})
    app.globalData.toSearch = v
    app.globalData.shopPageFlag = 0
    console.log("front_global:",app.globalData.toSearch)
    wx.navigateTo({
      url: '/pages/search/search'
    })
    //之后不搜索
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var hotTags = app.globalData.hotTagsGlobal
    this.data.hotTagsList = hotTags
    this.setData({
      hotTagsList:this.data.hotTagsList
    })
    console.log("跳转至热搜页面，获取全局hotTags",hotTags)
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