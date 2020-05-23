// pages/team2/interest/index.js
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
    headImageNum: [],
    be_headImageNum:[],
    list:[],
    be_list:[]
  },
  look(e){
    wx.navigateTo({
      url: '/pages/userpage/userpage?upload='+e.currentTarget.dataset.it.open_id+'&name='+e.currentTarget.dataset.it.name
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
    var _this=this
    wx.cloud.callFunction({
      name: "get_label",
      data:{
        id:app.globalData.open_id
      },
      success(res){
        _this.setData({
          list:res.result.data[0].interest
        })
        _this.setData({
          be_list:res.result.data[0].be_interested
        })
        var i
        if((res.result.data[0].interest!=undefined)){
          for(i=0;i<res.result.data[0].interest.length;i++){
            let temp="headImageNum["+i+"]"
            _this.setData({
              [temp]: Math.floor(Math.random()*3) + 1
            })
          }
        }
        if((res.result.data[0].be_interested!=undefined)){
          for(i=0;i<res.result.data[0].be_interested.length;i++){
            let temp="be_headImageNum["+i+"]"
            _this.setData({
              [temp]: Math.floor(Math.random()*3) + 1
            })
          }
          console.log("be_interested",_this.data.be_headImageNum)
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