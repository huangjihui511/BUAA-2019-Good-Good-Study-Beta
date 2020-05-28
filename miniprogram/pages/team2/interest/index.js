// pages/team2/interest/index.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab:["关注列表","被关注列表","搜索用户","为你推荐"],
    interest_refresh_flag:[],
    be_interested_refresh_flag:[],
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
    search_imageNum:[],
    recommend_imageNum:[],
    headImageNum: [],
    be_headImageNum:[],
    list:[],
    be_list:[],
    inputValue:"",
    TabCur:0,
    scrollLeft:0,
    search_list:[],
    recommend_list:[],
    open_id:''
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  confirm: function() {
    var _this=this
    this.data.search_list=[]
    var res=db.collection('user').where({
      user_name: db.RegExp({
        regexp: _this.data.inputValue,
        options: 'i',
      })
    }).get({
      success:function(res) {
        console.log(res)
        _this.setData({
          search_list:res.data
        })
        var i
        for(i=0;i<res.data.length;i++){
          let temp="search_imageNum["+i+"]"
          _this.setData({
            [temp]: Math.floor(Math.random()*3) + 1
          })
        }
        console.log(_this.data.search_list)
      }
    })
  },
  bindConfirmClick: function(e) {
    var value = e.detail.value
    this.setData(
      {
        inputValue:value
      }
    );
    console.log(value)
  },
  look(e){
    console.log("222"+e.currentTarget.dataset.it.user_name)
    wx.navigateTo({
      url: '/pages/userpage/userpage?upload='+e.currentTarget.dataset.it.open_id+'&name='+e.currentTarget.dataset.it.user_name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var judge = options.judge
    console.log("judge:",judge)
    if (judge == 1) {
      wx.setNavigationBarTitle({
        title: 'ta的关注'
      })
      this.data.open_id = options.open_id
    }
    else {
      this.data.open_id = app.globalData.open_id
    }
    console.log("open_id:",this.data.open_id)
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
    
    db.collection('user').orderBy('exp', 'desc')
    .get({
      success(res){
        console.log(res)
        var temp=[]
        var i
        var j=0
        for(i=0;j<20;j++){
          if(res.data[j].user_name!=undefined){
            temp[i]=res.data[j]
            i++
          }
        }
        var k
        for(k=0;k<i;k++){
          let temp="recommend_imageNum["+k+"]"
          _this.setData({
            [temp]: Math.floor(Math.random()*3) + 1
          })
        }
        _this.setData({
          recommend_list:temp
        })
      }
    })
    wx.cloud.callFunction({
      name: "get_label",
      data:{
        id:_this.data.open_id
      },
      success(res){
        console.log("11111",res)
        if(res.result.data[0].look_time==undefined){
          if(res.result.data[0].interest!=undefined){
            var i
            var interest_refresh_flag_temp=[]
            for(i=0;i<res.result.data[0].interest.length;i++){
              interest_refresh_flag_temp[i]=true
            }
            _this.setData({
              interest_refresh_flag:interest_refresh_flag_temp
            })
          }
          if(res.result.data[0].be_interested!=undefined){
            var i
            var be_interested_refresh_flag_temp=[]
            for(i=0;i<res.result.data[0].interest.length;i++){
              be_interested_refresh_flag_temp[i]=true
            }
            _this.setData({
              be_interested_refresh_flag:be_interested_refresh_flag_temp
            })
          }
        }
        else{
          var i
          var temp=res.result.data[0].look_time
          if(res.result.data[0].be_interested!=undefined){
            for(i=0;i<res.result.data[0].be_interested.length;i++){
              console.log(i,res.result.data[0].be_interested[i].open_id)
              wx.cloud.callFunction({
                name: "get_label_only_for_team2",
                data:{
                  id:res.result.data[0].be_interested[i].open_id,
                  index:i
                },
                success(res){
                  let temp1="be_interested_refresh_flag["+res.result[1]+"]"
                  console.log("222",res)
                  if(res.result[0].data[0].refresh_time==undefined){
                    _this.setData({
                      [temp1]:false
                    })
                  }
                  else{
                    console.log(new Date(temp))
                    console.log(new Date(res.result[0].data[0].refresh_time))
                    console.log("5555",new Date(res.result[0].data[0].refresh_time)-new Date(temp))
                    if(new Date(res.result[0].data[0].refresh_time)-new Date(temp)>=0){
                      _this.setData({
                        [temp1]:true
                      })
                    }
                    else{
                      _this.setData({
                        [temp1]:false
                      })
                    }
                  }
                  console.log("333",res.result[1],_this.data.be_interested_refresh_flag[res.result[1]])
                }
              })
            }
          }
          if(res.result.data[0].interest!=undefined){
            for(i=0;i<res.result.data[0].interest.length;i++){
              console.log(i,res.result.data[0].interest[i].open_id)
              wx.cloud.callFunction({
                name: "get_label_only_for_team2",
                data:{
                  id:res.result.data[0].interest[i].open_id,
                  index:i
                },
                success(res){
                  let temp1="interest_refresh_flag["+res.result[1]+"]"
                  console.log("222",res)
                  if(res.result[0].data[0].refresh_time==undefined){
                    _this.setData({
                      [temp1]:false
                    })
                  }
                  else{
                    console.log(new Date(temp))
                    console.log(new Date(res.result[0].data[0].refresh_time))
                    console.log("5555",new Date(res.result[0].data[0].refresh_time)-new Date(temp))
                    if(new Date(res.result[0].data[0].refresh_time)-new Date(temp)>=0){
                      _this.setData({
                        [temp1]:true
                      })
                    }
                    else{
                      _this.setData({
                        [temp1]:false
                      })
                    }
                  }
                  console.log("333",res.result[1],_this.data.interest_refresh_flag[res.result[1]])
                }
              })
            }
          }
        }
        wx.cloud.callFunction({
          name: 'change_look_time',
          data: {
            id:_this.data.open_id,
            time:new Date()
          }
        })
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