// miniprogram/pages/aphorism/aphorism.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open_id: '',
    user_id: '123',
    info:"",
    my_aphorism:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      open_id: options.open_id
    })
  },

  getinput(e){
    this.data.my_aphorism=e.detail.value
  },

  finish:function(){
    var _this=this
    wx.showLoading({
      title: '检测文字中',
      duration: 5000
    })
    wx.cloud.callFunction({      
      name: 'textCheck',      
      data: ({        
        text:_this.data.my_aphorism    
      }),
      success: res => {
        wx.hideLoading()
        if (res.result.errCode != 0) {
          wx.showToast({
            title: '文字违规',
          })
          return
        }
        else{
          console.log(_this.data.my_aphorism)
          wx.cloud.callFunction({
            name: 'add_aphorism',
            data:{
              open_id: _this.data.open_id,
              aphorism: _this.data.my_aphorism,
            },
            success: function(res){
              console.log('what!!!!!!!!!!!!!!!!!!!!')
            },
            fail:function(error){
              console.log(error)
            }
          })
          wx.navigateTo({
            url: '../team2/my/index'
          })
        }
      }
    })

    
    /*db.collection('user').where({
      open_id: this.data.open_id
    }).get({
      success:function(res){
        console.log(res)
        this.setData({
          user_id:res.data[0]._id
        })
        console.log(this.data.user_id)
        db.collection('user').doc(this.data.user_id).set({
          data:{
            aphorism: this.data.my_aphorism
          },
          success:function(res){
            wx.navigateTo({
              url: '../team2/my/index'
            })
          },
          fail:function(res){
            console.log(res)
          }
        })
      }
    })*/
    /*.update({
      data:{
        aphorism: this.data.my_aphorism
      },
      success: function(res){*/
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