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
    collection: [],
    have_shop_collection:[],
    no_shop_collection:[],
    do_interest:"",
    upload:0,
    upload_name:"",
  },
  interest_or_no(){
    var _this=this
    if(this.data.do_interest=="+关注"){
      wx.cloud.callFunction({
        name: "get_label",
        data:{
          id:app.globalData.open_id
        },
        success(res){
          console.log(res)
          console.log("999",res.result.data[0].expression_set)
          wx.cloud.callFunction({
            name: "change_interest",
            data:{
              id:app.globalData.open_id,
              flag:true,
              interest:_this.data.upload,
              name:_this.data.upload_name,
              expression_set:res.result.data[0].expression_set
            },
            success(res){ 
              _this.setData({
                do_interest:"取消关注"
              })
              console.log(res)
            }
          })
        }
      })
    }
    else{
      wx.cloud.callFunction({
        name: "change_interest",
        data:{
          id:app.globalData.open_id,
          flag:false,
          interest:_this.data.upload
        },
        success(res){
          _this.setData({
            do_interest:"+关注"
          })
          console.log(res)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    this.setData({
      upload:options.upload
    })
    this.setData({
      upload_name:options.name
    })
    wx.cloud.callFunction({
      name: "get_label",
      data:{
        id:app.globalData.open_id
      },
      success(res){
        console.log(res)
        if(res.result.data[0].interest!=undefined){
          var i
          _this.setData({
            do_interest:"+关注"
          })
          for(i=0;i<res.result.data[0].interest.length;i++){
            if(res.result.data[0].interest[i].open_id==options.upload){
              _this.setData({
                do_interest:"取消关注"
              })
              break
            }
          }
        }
      }
    })
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
        var temp=res.data[0].expression_set
        var no_shop_public_expressions=[]
        var public_expressions=[]
        var i,j,k,h
        k=0
        h=0
        console.log(temp)
        for(i=0;i<temp.length;i++){
          if(temp[i].tags!=undefined){
            for(j=0;j<temp[i].tags.length;j++){
              if(temp[i].tags[j].name=="未公开"){
                break
              }
            }
            if(j==temp[i].tags.length){
              if((temp[i].tags.length==2)&&(temp[i].tags[1].name=="商店")){}
              else{
                no_shop_public_expressions[k]=temp[i]
                k++
              }
              public_expressions[h]=temp[i]
              h++
            }
          }
        }
        this.setData({
          uploader: res.data,
          collection: public_expressions,
          have_shop_collection:public_expressions,
          no_shop_collection:no_shop_public_expressions,
          uploaderName: res.data[0].name
        })
        console.log(this.data.uploader)
        console.log(this.data.collection)
        console.log(this.data.have_shop_collection)
        console.log(this.data.no_shop_collection)
      })
    }
    this.setData({
      headImageNum: Math.floor(Math.random()*3) + 1
    })
    console.log(this.data.headImageNum)
  },

  changestyle:function(e){
    let index=e.currentTarget.dataset.id;
    let _this=this
    if(index==0){
      this.setData({
        collection:_this.data.have_shop_collection
      })
    }
    else{
      this.setData({
        collection:_this.data.no_shop_collection
      })
    }
    this.setData({
      TopIndex:index
    })
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
    let index=e.currentTarget.dataset.id;
    let _this=this
    if(index==0){
      this.setData({
        collection:_this.data.have_shop_collection
      })
    }
    else{
      this.setData({
        collection:_this.data.no_shop_collection
      })
    }
    this.setData({
      TopIndex:index
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