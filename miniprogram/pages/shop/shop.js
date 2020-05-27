//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    search_list:[],
    search_imageNum:[],
    inputValue:"",
    recommend_list:[],
    recommend_imageNum:[],
    images: [
      {file_id : "/images/test1.jfif"
      },
      {file_id :  "/images/test3.jpg"},
      {file_id : "/images/test2.jpg"}
    ],
    //悬浮窗
    isIos:false,
    left:0,
    top:0,
    isLoading:0,
    test_cloud_setdata:0,
    user_coin:0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    image_url: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    focus: false,
    inputValue: '',
    toSearch: '',
    testButton: '',
    //热搜关键词
    hotTags:[],
    globalShowIndex:0,
    showListCache:[],
    showPicList: [[{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}
    ],[{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}
    ],[{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}],
    [{file_id:'',tag:''},{file_id:'',tag:''},{file_id:'',tag:''}]
    ],
    showStaticPics1:[
      [{file_id:'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/nigger1.jpeg',
        tag:'黑人抬棺'},
      {file_id:'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/nigger2.jpeg',
        tag:'黑人抬棺'},
      {file_id:'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/nigger3.jpg',
        tag:'黑人抬棺'}]
    ],
    user_rank:5,
    user_exp:0,
    user_openid: '123',
    rankExp:[0,5,15,30,50,100,200,500,1000,2000,3000,6000,10000,18000,30000,60000,
      100000,300000],
    user_exp_Upbound:25,
    //轮播
    /*swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }],*/
    
    swiperList: [{
      id: 0,
      type: 'image',
      tag:'鬼刀',
      url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/guidao1.jpg'
    }, {
      id: 1,
      type: 'image',
      tag:'鬼刀',
      url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/guidao2.jpg',
    }, {
      id: 2,
      type: 'image',
      tag:'鬼刀',
      url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/guidao3.jpg'
    }, {
      id: 3,
      type: 'image',
      tag:'鬼刀',
      url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/guidao4.jpg'
    }],
    cardCur: 0,
    TabCur: 0,
    scrollLeft:0,
    //自制表情记录列表
    userUploadList:[],
    userSwiper:[],
    //上传的用户列表
    userList:[],
    //头像
    headImage: [{ url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/animal1.png',},
      {url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/animal2.png' },
      {url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/animal3.png'},
      {url: 'cloud://project-database-v58ji.7072-project-database-v58ji-1301962342/animal4.png'}],
    headImage_index:[],
  },

  jump_to_more:function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    console.log("userUploadList:",this.data.userUploadList)
    app.globalData.userList = this.data.userUploadList[index]
    //console.log(that.data.userUploadList)
    wx.navigateTo({
      url: '/pages/moreUserImages/moreUserImages?id='+
      that.data.userList[index]['open_id']+'&name='+
      that.data.userList[index]['user_name']
    })
  },

  tabSelect(e) {
    var that = this
    this.TabCur = e.currentTarget.dataset.id
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
    wx.cloud.callFunction({
      name:'image_visit_times',
      data:{
        request:6
      },
      success:function(res) {
        console.log("request6成功:",res.result)
        var temp1 = []
        var tempSwiper = []
        for (var i = 0;i < res.result.data2.length;i++) {
          temp1.push(res.result.data2[i])
          var user1Swiper = []
          for (var run = 0;run < res.result.data2[i].length;run++) {
            if (run < 5) {
              user1Swiper.push(res.result.data2[i][run])
            }
          }
          tempSwiper.push(user1Swiper)
        }
        that.data.userSwiper = tempSwiper
        that.setData({
          userSwiper:that.data.userSwiper
        })
        that.data.userUploadList = temp1
        that.setData({
          userUploadList:that.data.userUploadList
        })
        console.log("userUploadList:",that.data.userUploadList)
        var temp2 = []
        for (var j = 0;j < res.result.data1.length;j++) {
          temp2.push(res.result.data1[j])
        }
        that.data.userList = temp2
        that.setData({
          userList:that.data.userList
        })
        console.log("userList:",that.data.userList)
        that.data.headImage_index = []
        //头像
        for (var k = 0;k < j;k++) {
          that.data.headImage_index.push(Math.floor(Math.random()*3) + 1)
        }
        that.setData({
          headImage_index:that.data.headImage_index
        })
      }
    })

    //首先 更新自制推荐表情
    /*wx.cloud.callFunction({
      name:'image_visit_times',
      data:{
        request:5
      },
      success:function(res) {
        that.data.userUploadList = []
        that.setData({
          userUploadList:that.data.userUploadList
        })
        console.log("查找用户上传记录成功")
        var datas = res.result.data.data
        console.log("data:",datas)
        for (var i = 0;i < datas.length;i++) {
          var item = datas[i]
          console.log("item:",item)
          var tags = item.tags
          var userName = item.user_name
          var path = item.file_id
          var judgeOpen = 0
          for (var j = 0;j < tags.length;j++) {
            var tag = tags[j]
            console.log("tagName:",tag['name'])
            if (tag['name'] == '公开') {
              judgeOpen = 1
              break
            }
          }
          if (judgeOpen == 1) {
            console.log("公开")
            var single = {path:path,userName:userName}
            that.data.userUploadList.push(single)
            that.setData({
              userUploadList:that.data.userUploadList
            })
          }
        }
      }
    })*/
  },

  jump2userpage:function(e) {
    var app = getApp()
    console.log(e)
    // app.globalData.data = {'imagepath':imagepath}
    var uploaduser = e.currentTarget.dataset.uploaduser
    var uploadusername = e.currentTarget.dataset.uploadusername
    console.log("uploaduser:",uploaduser)
    console.log("uploadusername:",uploadusername)
    wx.navigateTo({
      url: '/pages/userpage/userpage?upload='+uploaduser+'&name='+uploadusername
    })
  },

  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
    //console.log(this.data.cardCur)
  },
  
  hotTagJump:function(e) {
    var tag = e.currentTarget.dataset.tag
    console.log("hotTagJump's tag:",tag)
    this.data.inputValue = tag
    this.confirm()
  },

  hotTagMore:function(e) {
    wx.navigateTo({
      url: '/pages/hotSearch/hotSearch',
    })
  },

  jumpToExp:function(e) {
    wx.navigateTo({
      url: '/pages/aboutExp/aboutExp',
    })
  },

  jump_to_search:function(e) {
    var kind = e.currentTarget.dataset.kind
    app.globalData.shopPageTitle = kind
    if (kind == "为你推荐") {
      app.globalData.shopPageFlag = 1
    }
    else {
      app.globalData.shopPageFlag = 2
      app.globalData.toSearch = kind
    }
    console.log("front_global:",app.globalData.shopPageTitle)
    console.log("front_flag:",app.globalData.shopPageFlag)
    console.log("front_toSearch",app.globalData.toSearch)
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  shop_image_pagejump:function(e) {
    var app = getApp()
    console.log(e)
    var fileid = e.currentTarget.dataset.fileid
    var tag = e.currentTarget.dataset.tag
    var ifNoSimilar = e.currentTarget.dataset.judge
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
  else if ((judge == 1) && (ifNoSimilar != 1)) {
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
    if (ifNoSimilar == 1) {
      app.globalData.similarExpression = 0
      console.log("不显示相似表情:",app.globalData.similarExpression)
    }
    else if (ifNoSimilar == 2){
      app.globalData.similarExpression = 2
    }
    else {
      app.globalData.similarExpression = 1
    }
    wx.navigateTo({
      url: '/pages/index/index?url='+ e.currentTarget.dataset.fileid
    })
  },

  bindConfirmClick: function(e) {
    var value = e.detail.value
    this.setData(
      {
        inputValue:value
      }
    );
  },

  bindKeyInput:function(e) {
    var value = e.detail.value
    this.setData ({
      inputValue:value
    })
  },

  matchingInput:function(input,label) {
    console.log("是否匹配:",input.indexOf(label))
    if (input.indexOf(label) >= 0) {
      return 1
    }
    else {
      return 0
    }
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
    
   /* wx.cloud.callFunction({    
      name: 'login'  
    }).then(res=>{        
      console.log(res.result.openid)
      db.collection('expression').where({         
        openid: res.result.openid      
      }).get().then(res2=>{          
        console.log(res2);         
        this.setData({          
          images: res2.data        
        })      
      })    
    }) */
  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
      for (var i = 0;i < 18;i++) {
        var path = globalList[init+i]
        console.log("path:",path)
        var reflex1 = parseInt(i/3)
        var reflex2 = i%3
        this.data.showPicList[reflex1][reflex2]['file_id'] = path
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
      for (var i = 0;i < 18;i++) {
        var path = globalList[init+i]
        console.log("path:",path)
        var reflex1 = parseInt(i/3)
        var reflex2 = i%3
        this.data.showPicList[reflex1][reflex2]['file_id'] = path
        this.setData({
          showPicList:this.data.showPicList
        })
      }
    }
  },

  onLoad: function () {
    console.log("初始化热搜词")
    var that = this
    wx.cloud.callFunction({
      name:'image_visit_times',
      data:{
        request:3
      },
      success:function(res) {
        console.log("热搜res:",res)
        var resultArray = res.result.data
        console.log("resultArray:",resultArray)
        that.data.hotTags = resultArray
        that.setData({
          hotTags:that.data.hotTags
        })
        app.globalData.hotTagsGlobal = resultArray
      }
    })

    this.setData({
      globalShowIndex:this.data.globalShowIndex
    })
    wx.getSystemInfo({
      success: (res) => {
        if (res.platform == "android") {
          this.setData({
            isIos: false
          })
        }
      }
    })
    var that = this
    console.log("初始化推荐表情")
    db.collection('expression_visit_times').count({
      success:function(res) {
        var lengthAll = res.total
        var skip = 0
        console.log("推荐表情长度：",lengthAll)
        if (lengthAll > 12) {
          skip = lengthAll - 12
        }
        db.collection('expression_visit_times').limit(12).skip(skip).get({
          success:function(res) {
            var paths = res.data
            console.log("初始推荐表情:",paths)
            console.log(paths.length)
            for (var i = 0;i < paths.length;i++) {
              var path = paths[i]['id']
              var tag = paths[i]['tag']
              //console.log(paths[i])
              //console.log("init path:",path)
              that.data.showPicList[parseInt(i/3)][i%3]['file_id'] = path
              that.data.showPicList[parseInt(i/3)][i%3]['tag'] = tag
              that.setData({
                showPicList:that.data.showPicList
              }) 
            }
          }
        })
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
        console.log(tempid)
        db.collection('user').where({
          open_id: tempid
        }).get().then(res=>{   
          //console.log(res.data[0].exp)
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
  * 拖拽移动(补丁)
  */
 handleSetMoveViewPos: function (e) {
  // 在ios下永远都不会走这个方案，以免引起无用的计算
  if (!ios) {
    const MOVE_VIEW_RADIUS = 30 // 悬浮窗半径

    const touchPosX = e.touches[0].clientX
    const touchPosY = e.touches[0].clientY

    const moveViewCenterPosX = this.data.left + MOVE_VIEW_RADIUS
    const moveViewCenterPosY = this.data.top + MOVE_VIEW_RADIUS

    // 确保手指在悬浮窗上才可以移动
    if (Math.abs(moveViewCenterPosX - touchPosX) < MOVE_VIEW_RADIUS && Math.abs(moveViewCenterPosY - touchPosY) < MOVE_VIEW_RADIUS) {
      if (touchPosX > 0 && touchPosY > 0) {
        this.setData({
          left: touchPosX - MOVE_VIEW_RADIUS,
          top: touchPosY - MOVE_VIEW_RADIUS
        })
      } else {
        this.setData({
          left: 20, // 默认显示位置 left距离
          top: 250  // 默认显示位置 top距离
        })
      }
    }
  }
},
/**
* 拖拽移动
*/
handleTouchMove: function (e) {
  const MOVE_VIEW_RADIUS = 30 // 悬浮窗半径

  const touchPosX = e.touches[0].clientX
  const touchPosY = e.touches[0].clientY

  if (touchPosX > 0 && touchPosY > 0) {
    this.setData({
      left: touchPosX - MOVE_VIEW_RADIUS,
      top: touchPosY - MOVE_VIEW_RADIUS
    })
  } else {
    this.setData({
      left: 20, //默认显示位置 left距离
      top: 250  //默认显示位置 top距离
    })
  }
  },
  look(e){
    wx.navigateTo({
      url: '/pages/userpage/userpage?upload='+e.currentTarget.dataset.it.open_id+'&name='+e.currentTarget.dataset.it.user_name
    })
  },
  confirm_team2: function() {
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
  bindConfirmClick_team2: function(e) {
    var value = e.detail.value
    this.setData(
      {
        inputValue:value
      }
    );
    console.log(value)
  },
  setSkinNormalTitle: function () {
    wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#0387FE',
    })
  }, 

  onShow:function(){
    var that = this
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
    console.log("初始化热搜词")
    var that = this
    wx.cloud.callFunction({
      name:'image_visit_times',
      data:{
        request:3
      },
      success:function(res) {
        console.log("热搜res:",res)
        var resultArray = res.result.data
        console.log("resultArray:",resultArray)
        that.data.hotTags = resultArray
        that.setData({
          hotTags:that.data.hotTags
        })
        app.globalData.hotTagsGlobal = resultArray
      }
    })

    if (app.globalData.skin == "normal") {
        that.setSkinNormalTitle()
    } else {
        app.setSkinPinkTitle()
    }
  }
})
