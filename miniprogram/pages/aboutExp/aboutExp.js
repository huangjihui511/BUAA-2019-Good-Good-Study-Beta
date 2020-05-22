// miniprogram/pages/aboutExp/aboutExp.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur:0,
    user_rank:5,
    user_exp:0,
    user_openid: '123',
    rankExp:[0,5,15,30,50,100,200,500,1000,2000,3000,6000,10000,18000,30000,60000,
      100000,300000],
    user_exp_Upbound:25

  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log("初始化推荐表情")
    db.collection('expression').where({
      public: true
    }).limit(9).get({
      success:function(res) {
        var paths = res.data
        console.log("初始推荐表情:",paths)
        console.log(paths.length)
        for (var i = 0;i < paths.length;i++) {
          var path = paths[i]['file_id']
          console.log(paths[i])
          console.log("init path:",path)
          that.data.showPicList[parseInt(i/3)][i%3]['file_id'] = path
          that.setData({
            showPicList:that.data.showPicList
          }) 
        }
      }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    console.log('userInfo',this.data.userInfo)
    wx.cloud.callFunction({
      name:'add_user_name',
      data:{
        id:app.globalData.open_id,
        name:that.data.userInfo.nickName
      }
    })
    var that = this
    var tempid = '123'
    wx.cloud.callFunction({
      name:'login',
      success: res => {
        console.log('success:', res)
        that.setData({
          user_openid: res.result.openid
        })
        tempid = that.data.user_openid
        //app.globalData.open_id=tempid
        console.log(tempid)
        db.collection('user').where({
          open_id: tempid
        }).get().then(res=>{   
          console.log("111111",res)
          that.setData({          
            user_exp: res.data[0].exp     
          })   
          that.calUserRank()
        })    
      },
      fail :console.error
    })
   // this.calUserRank()
    console.log("用户经验：",this.data.user_exp)
  },
  calUserRank: function() {
    //根据用户的经验计算等级
    var exp = this.data.user_exp
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
      user_exp_Upbound: upbound
    })
    console.log("rank:"+this.data.user_rank+"expup:"+this.data.user_exp_Upbound)
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