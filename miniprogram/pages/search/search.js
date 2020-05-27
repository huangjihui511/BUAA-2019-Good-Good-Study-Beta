const app = getApp()
const db = wx.cloud.database()
Page(
  {
    data: {
      inputValue: '',
      toSearch: '',
      globalShowIndex:0,
      showListCache:[],
      //图片列表
      showPicList: [
        [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
        [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
        [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
        [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
        [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
        [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
      ],
    },

    onLoad:function(e) {
      var searchString = app.globalData.toSearch
      var pageJudge = app.globalData.shopPageFlag
      //如果judge为0，由搜索跳转至当前页面；judge为1，由推荐表情转至当前页面；
      //judge为2，由商店的某个热门模块转至当前页面
      if (pageJudge == 0) {
        this.data.inputValue = searchString
        console.log("searchString:",searchString)
        this.setData({
          inputValue:this.data.inputValue
        })
        wx.setNavigationBarTitle({
          title: searchString
        })
        this.confirm()
      }
      //显示所有推荐表情
      else if (pageJudge == 1){
        var title = app.globalData.shopPageTitle
        console.log("title",title)
        this.data.inputValue = ''
        this.setData({
          inputValue:this.data.inputValue
        })
        wx.setNavigationBarTitle({
          title: title,
        })
        this.showRecommond()
      }
      //显示某个热门标签的所有表情
      else if (pageJudge == 2) {
        this.data.inputValue = searchString
        console.log("searchString:",searchString)
        this.setData({
          inputValue:this.data.inputValue
        })
        wx.setNavigationBarTitle({
          title: searchString
        })
        this.confirm()
      }
    },

    //点击图片
    shop_image_pagejump:function(e) {
      var app = getApp()
      console.log(e)
      var fileid = e.currentTarget.dataset.fileid
      var tag = e.currentTarget.dataset.tag
      app.globalData.shopImageTag = tag
      console.log("tag:",app.globalData.shopImageTag)
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
      app.globalData.similarExpression = 1
      // app.globalData.data = {'imagepath':imagepath}
      wx.navigateTo({
        url: '/pages/index/index?url='+ e.currentTarget.dataset.fileid
      })
    },

    //点击确认
    bindConfirmClick: function(e) {
      var value = e.detail.value
      this.setData(
        {
          inputValue:value
        }
      );
    },
  
    //匹配算法(暂未使用)
    matchingInput:function(input,label) {
      console.log("是否匹配:",input.indexOf(label))
      if (input.indexOf(label) >= 0) {
        return 1
      }
      else {
        return 0
      }
    },

    //显示推荐表情
    showRecommond:function() {
      var that = this
      console.log("显示推荐表情")
      wx.cloud.callFunction({
        name:'image_visit_times',
        data:{
         request:1
        }
      }).then(res=>{
        console.log("call_cloud_success:",res)
        var paths = res.result.data
        var globalPicIndex = 0
        console.log("paths:",paths)
        for (var i = 0;i < paths.length;i++) {
          var path = paths[i]['id']
          var tag = paths[i]['tag']
          //console.log(paths[i])
          //console.log("init path:",path)
          that.data.showListCache[globalPicIndex] = {'file_id':path,'tag':tag}
          if (globalPicIndex < 18) {
            that.data.showPicList[parseInt(i/3)][i%3]['file_id'] = path
            that.data.showPicList[parseInt(i/3)][i%3]['tag'] = tag
            that.setData({
              showPicList:that.data.showPicList
            }) 
          }
          globalPicIndex++
        }
        var fill = globalPicIndex
        for (;fill < 18;fill++) {
          that.data.showPicList[parseInt(fill/3)][fill%3]['file_id'] = ''
          that.setData({
            showPicList:that.data.showPicList
          })
        }
      })
    },

    //搜索图片
    confirm: function() {
      console.log("confirm")
      var v = this.data.inputValue
      this.setData({toSearch:v})

      //顶部导航栏标题
      wx.setNavigationBarTitle({
        title: v
      })

      let that = this
      this.data.globalShowIndex = 0
      this.data.showListCache = []
  
      for (var i = 0;i < 5;i++) {
        for (var j = 0;j < 3;j++) {
          this.data.showPicList[i][j]['file_id'] = ''
          this.setData({
            showPicList:this.data.showPicList
          })
        }
      }
      //console.log("showPicList:",this.data.showPicList)
  
      //暂存所有查找的图片路径
      var tempPaths = []
      
      var labels=['label7']
      labels[0] = v
      var globalPicIndex = 0
      wx.cloud.init()
      //索引方式
      var judge = 3
      //for (var i = 0;i < labels.length;i++) {
        //var label = labels[i]
      for (var i = 0;i < 1;i++) {  
        var label = labels[i]
          if (judge == 3) {
            db.collection("tag_names").get({
              success:function(res) {
                wx.showLoading({
                  title: '加载中',
                 })
                 setTimeout(function () {
                  wx.hideLoading()
                  if (globalPicIndex == 0){
                    console.log("未找到：",globalPicIndex)
                    wx.showToast({
                    title: '抱歉，未找到您想要的表情，换个关键词试试^_^?', // 标题
                    icon: 'none',  // 图标类型，none
                    duration: 2500  // 提示窗停留时间，默认1500ms
                  })
                  }
                  }, 20000)
                var all_tags = res.data[0].name
                //console.log("all_tags:",all_tags)
                for (var runover = 0;runover < all_tags.length;runover++) {
                  var judge = 0 
                  var inputString = String(label)
                  var tag = all_tags[runover]
                  var labelString = String(tag)
                  //console.log(inputString,"---",labelString,"是否匹配:",inputString.indexOf(labelString))
                  if (inputString.indexOf(labelString) >= 0) {
                    judge = 1
                  }
                  if (judge == 1) {
                    //console.log("匹配成功")
                    wx.cloud.callFunction({
                      name:'image_visit_times',
                      data:{
                        request:2,
                        tag:tag
                      },
                      success:function(res) {
                        console.log("更新标签检索次数成功!")
                      }
                    })
                    var path
                    db.collection("tags").where({
                      name:tag
                    }).get({
                      success:function(res) {
                        var datas = res.data
                        for (var f = 0;f < datas.length;f++) {
                          var ids = datas[f]['expression_id']
                          //console.log("ids:",ids) 
                          for (var key in ids) {
                            var reflex1 = globalPicIndex%18
                              var reflex2 =  parseInt(reflex1/3)
                              var reflex3 = reflex1%3
                              //console.log("globalPicIndex:",globalPicIndex)
                              //console.log("key:",key)
                            that.data.showListCache[globalPicIndex] = {'file_id':ids[key],'tag':tag}
                            if (globalPicIndex < 18) {
                              that.data.showPicList[reflex2][reflex3]['file_id'] = ids[key]
                              that.data.showPicList[reflex2][reflex3]['tag'] = tag
                              that.setData({
                                showPicList:that.data.showPicList
                              }) 
                            }
                            globalPicIndex++
                        }
                      }
                      var fill = globalPicIndex
                      if (fill < 18) {
                        for (;fill < 18;fill++) {
                          that.data.showPicList[parseInt(fill/3)][fill%3]['file_id'] = ''
                          that.setData({
                            showPicList:that.data.showPicList
                          })
                        }
                      }
                      }
                    })
                    // 数据加载完成，隐藏弹窗
                    wx.hideLoading()
                    break;
                  }
                  if (runover == all_tags.length) {
                    // 数据加载完成，隐藏弹窗
                    wx.hideLoading()
                    console.log("结束")
                  }
                  if ((runover == all_tags.length) && (globalPicIndex == 0)) {
                    // 数据加载完成，隐藏弹窗
                    wx.hideLoading()
                  }
                  if ((runover == all_tags.length) && (globalPicIndex > 0)) {
                    // 数据加载完成，隐藏弹窗
                    wx.hideLoading()
                  }
                  if (globalPicIndex >= 9) {
                    // 数据加载完成，隐藏弹窗
                    wx.hideLoading()
                    break
                  }
                } 
              }
            })
          }
        }
    },

    //悬浮窗翻页
    reFreshL:function() {
      var loadTime = this.data.globalShowIndex
      var init = loadTime*18
      var globalList = this.data.showListCache
      console.log("globalList:",globalList)
      if (init == 0) {
        wx.showToast({
          title: '到头了^_^',
          duration: 2000
        })
      }
      else {
        this.data.globalShowIndex--
        this.setData({
          globalShowIndex:this.data.globalShowIndex
        })
        var length = globalList.length
        var init = this.data.globalShowIndex*18
        for (var i = 0;(i < 18)&&(init+i < length);i++) {
          var path = globalList[init+i]['file_id']
          var tag = globalList[init+i]['tag']
          console.log("path:",path)
          console.log("tag:",tag)
          var reflex1 = parseInt(i/3)
          var reflex2 = i%3
          this.data.showPicList[reflex1][reflex2]['file_id'] = path
          this.data.showPicList[reflex1][reflex2]['tag'] = tag
          this.setData({
            showPicList:this.data.showPicList
          })
        }
        for (;i < 18;i++) {
          var reflex1 = parseInt(i/3)
          var reflex2 = i%3
          this.data.showPicList[reflex1][reflex2]['file_id'] = ''
          this.data.showPicList[reflex1][reflex2]['tag'] = ''
          this.setData({
            showPicList:this.data.showPicList
          })
        }
      }
    },
  
    reFreshR:function() {
      var loadTime = this.data.globalShowIndex
      var init = (loadTime+1)*18
      var globalList = this.data.showListCache
      console.log("globalList:",globalList)
      if (init >= globalList.length) {
        wx.showToast({
          title: '抱歉，没有更多了',
          duration: 2000
        })
      }
      else {
        this.data.globalShowIndex++
        this.setData({
          globalShowIndex:this.data.globalShowIndex
        })
        var length = globalList.length
        for (var i = 0;(i < 18)&&(init+i < length);i++) {
          var path = globalList[init+i]['file_id']
          var tag = globalList[init+i]['tag']
          console.log("path:",path)
          console.log("tag:",tag)
          var reflex1 = parseInt(i/3)
          var reflex2 = i%3
          this.data.showPicList[reflex1][reflex2]['file_id'] = path
          this.data.showPicList[reflex1][reflex2]['tag'] = tag
          this.setData({
            showPicList:this.data.showPicList
          })
        }
        for (;i < 18;i++) {
          var reflex1 = parseInt(i/3)
          var reflex2 = i%3
          this.data.showPicList[reflex1][reflex2]['file_id'] = ''
          this.data.showPicList[reflex1][reflex2]['tag'] = ''
          this.setData({
            showPicList:this.data.showPicList
          })
        }
      }
    }
  }
)