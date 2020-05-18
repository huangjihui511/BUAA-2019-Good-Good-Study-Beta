// pages/team2/expression_information/index.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expression:'',
    icon: [{ name: 'appreciate', isShow: true,chinese_name:"转发",bind:'forward'}, { name: 'check', isShow: true ,chinese_name:'保存到手机',bind:'save'}, { name: 'close', isShow: false }, { name: 'edit', isShow: true ,chinese_name:'编辑图片',bind:"edit"}, { name: 'emoji', isShow: true ,chinese_name:"修改标签",bind:"change_label"}, { name: 'favorfill', isShow: false }, { name: 'favor', isShow: true ,chinese_name:'收藏到微信',bind:"collect"}],
    comment:[],
  },
  getinput(e){
    this.data.comment=e.detail.value
  },
  commented(){
    wx.showToast({
      title: '评论中',
      icon: 'loading',
      duration: 100000
    })
    var _this=this
    console.log("评论",_this.data.comment)
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
            src:_this.data.expression,
            comment:{"open_id":app.globalData.open_id,"user_name":res.result.data[0].user_name,"comment":_this.data.comment,"time":new Date()}
          },
          success(res){
            console.log(res)
            
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 1000,
          success(res){
            wx.redirectTo({
              url: '../expression_information/index?expression='+_this.data.expression,
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
    console.log("1111111")
    wx.cloud.downloadFile({
      fileID: _this.data.expression,
      success(res) {
        console.log(res.tempFilePath)
        wx.reLaunch({
          url: '../team2_load_for_team1/index?src=' + res.tempFilePath,
        })
      }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    console.log("1111",this.options.expression)
    this.setData({
      expression:this.options.expression
    })
    wx.cloud.callFunction({
      name:"get_expression",
      data:{
        data1:_this.options.expression
      },
      success(res){
        _this.setData({
          comment:res.result.data[0].comment
        })
        console.log("1111",_this.data.comment)
      }
    })
    /*
    if(this.options.src!=undefined){
      
    }*/
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