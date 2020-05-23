// pages/team2/change_labels/index.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    view_labels:[],
    no_view_labels:[],
    delete_labels:[],
    checkbox: [{
      value: 0,
      name: '10元',
      checked: false,
      hot: true,
    }, {
      value: 1,
      name: '20元',
      checked: true,
      hot: false,
    }, {
      value: 2,
      name: '30元',
      checked: true,
      hot: true,
    }, {
      value: 3,
      name: '60元',
      checked: false,
      hot: true,
    }, {
      value: 4,
      name: '80元',
      checked: false,
      hot: false,
    }, {
      value: 5,
      name: '100元',
      checked: false,
      hot: false,
    }]
  },
  complete(){
    var that=this
    wx.cloud.callFunction({
      name:"change_labels",
      data:{
        id:app.globalData.open_id,
        labels:that.data.view_labels
      },
      success(res){
        wx.cloud.callFunction({
          name:"change_del_labels",
          data:{
            id:app.globalData.open_id,
            del_labels:that.data.no_view_labels
          },
          success(res){
            wx.showToast({
              title: '修改成功',
              icon: "success",
              duration: 1000,
              success(res){
                wx.reLaunch({
                  url: '../favorite_expression/index',
                })
              }
          })
          }
        })
      }
    })
  },
  delete(e){
    var i
    var temp=[]
    temp=this.data.no_view_labels;
    temp[temp.length]=this.data.view_labels[e.currentTarget.dataset.index]
    console.log(temp,temp.length,e)
    this.setData({
      no_view_labels:temp
    })
    temp=[]
    for(i=0;i<this.data.view_labels.length;i++){
      if(e.currentTarget.dataset.index!=i){
        temp[temp.length]=this.data.view_labels[i]
      }
    }
    this.setData({
      view_labels:temp
    })
  },
  add(e){    
    var i
    var temp=[]
    temp=this.data.delete_labels;
    temp[temp.length]=this.data.no_view_labels[e.currentTarget.dataset.index]
    console.log(temp,temp.length,e)
    this.setData({
      delete_labels:temp
    })
    temp=[]
    for(i=0;i<this.data.no_view_labels.length;i++){
      if(e.currentTarget.dataset.index!=i){
        temp[temp.length]=this.data.no_view_labels[i]
      }
    }
    this.setData({
      no_view_labels:temp
    })
  },
  
  de(e) {
    var i
    var temp=[]
    temp=this.data.view_labels;
    temp[temp.length]=this.data.delete_labels[e.currentTarget.dataset.index]
    console.log(temp,temp.length,e)
    this.setData({
      view_labels:temp
    })
    temp=[]
    for(i=0;i<this.data.delete_labels.length;i++){
      if(e.currentTarget.dataset.index!=i){
        temp[temp.length]=this.data.delete_labels[i]
      }
    }
    this.setData({
      delete_labels:temp
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that=this
    wx.cloud.callFunction({
      name:"get_label",
      data:{
        id:app.globalData.open_id,
      },
      success(res){
        if(res.result.data[0].labels!=undefined){
          that.setData({
            view_labels:res.result.data[0].labels
          })
        }
        if(res.result.data[0].del_labels!=undefined){
          that.setData({
            no_view_labels:res.result.data[0].del_labels
          })
        }
      }
    })
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