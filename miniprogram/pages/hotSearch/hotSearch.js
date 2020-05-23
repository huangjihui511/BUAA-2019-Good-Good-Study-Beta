// miniprogram/pages/hotSearch/hotSearch.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotTagsList:[],
    hotTagsImage:[],
    inputValue:''
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
    var that = this
    this.data.hotTagsList = hotTags
    this.setData({
      hotTagsList:this.data.hotTagsList
    })
    console.log("跳转至热搜页面，获取全局hotTags",hotTags)
    wx.cloud.callFunction({
      name:'image_visit_times',
      data:{
        request:4,
        data1:that.data.hotTagsList
      },
      success:function(res) {
        console.log("成功调用云函数")
        var paths = res.result.data
        console.log("tags对应的路径：",paths)
        that.data.hotTagsImage = paths
        that.setData({
          hotTagsImage:paths
        })
      }
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