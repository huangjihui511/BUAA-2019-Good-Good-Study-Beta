//index.js
//删除
const db = wx.cloud.database()
const app = getApp()
function add(a,b){
return a+b
}
Page({
  data: {
    expression:[],
    color:"black",
    all_select:"",
    selected:"",
    select_text:"选择",
    button_select:false,
    freq1:[],
    label1:[],
    images_src1 : [],
    images_srcs:[],
    labels:[[]],
    freqs:[],
    images_view_srcs:[],
    can_delete_selected:[],
    delete_selected:[],
    classes:['全部','公开','未公开','label2','label3','label4','label5','label6','label7'],
    navData:[
      {
          text: '全部',
          show:true,
      },
      {
          text: '商店',
          show:false,
      },
      {
          text: '使用频率',
          show:false,
      },
      {
          text: '公开',
          show:false,
      },
      {
          text: '未公开',
          show:false,
      },
      {
        text: '开心',
        show:false,
      },
      {
          text: '祝福',
          show:false,
      },
      {
          text: '贫穷',
          show:false,
      },
      {
          text: '嘲讽',
          show:false,
      },
      {
          text: '羡慕',
          show:false,
      },
      {
          text: '生气',
          show:false,
      }
    ],
    currentTab: 0,
    navScrollLeft: 0,
    clickcolor:"red"
  },
  onShow: function () {
    var that=this
    wx.cloud.callFunction({
      name:"get_recycle",
      data:{
        id:app.globalData.open_id,
      },
      success(res){
        var num 
        var images_src1=[];
        var delete_selected_temp=[];
        var can_delete_selected_temp=[];
        var expression_temp=[];
        if((res.result.data[0]==undefined)||(res.result.data[0].recycles==undefined)){
          num=0
        }
        else{
          num = res.result.data[0].recycles.length
        }
        for (var i = 0; i < num; i++) {
          expression_temp[i]= res.result.data[0].recycles[i]
          images_src1[i] = res.result.data[0].recycles[i].file_id
          delete_selected_temp[i]=false
          can_delete_selected_temp[i]=false
        }
        
        console.log(images_src1)
        let temp_view_src = "images_view_srcs"
        let temp_src = "images_srcs"
        let temp_delete_selected="delete_selected"
        let temp_can_delete_selected="can_delete_selected"
        that.setData({
          expression:expression_temp,
          [temp_view_src]: images_src1,
          [temp_src]: images_src1,
          [temp_delete_selected]: delete_selected_temp,
          [temp_can_delete_selected]:can_delete_selected_temp
        })
        
        console.log("111111111111111111111111111",that.data.expression)
      }
    })
  },
  delete_or_previewImage: function (e){
    if(this.data.can_delete_selected[e.currentTarget.dataset.index]==true){
      let temp_select_number="select_number"
      let temp_all_select="all_select"
      var count=0
      var i
      console.log(e)
      console.log(e.currentTarget.dataset.index)
      console.log(this.data.delete_selected[0])
      let temp_delete_selected="delete_selected["+e.currentTarget.dataset.index+"]"
      this.setData({
        [temp_delete_selected]:!this.data.delete_selected[e.currentTarget.dataset.index]
      })
      for(i=0;i<this.data.delete_selected.length;i++){
        if(this.data.delete_selected[i]==true){
          count++
        }
      }
      this.setData({
        [temp_all_select]:"全选",
        [temp_select_number]:"已选择"+count+"张图片"
      })
      console.log(this.data.delete_selected[e.currentTarget.dataset.index])
    }
    else{
      //setTimeout(function () {},1000)
      
      wx.showToast({
        title: '长按图片可转发',
        icon: 'loading',
        duration: 1000
      })
      console.log(e.currentTarget.dataset.srcs)
      wx.previewImage({
        current: e.currentTarget.dataset.src, // 当前显示图片的https链接
        urls: e.currentTarget.dataset.srcs, // 需要预览的图片https链接列表
      })
      
    }
  },
  forward(a,b){
    wx.showToast({
      title: '长按图片可转发',
      icon: 'loading',
      duration: 1000
    })
    
    wx.previewImage({
      current: a, // 当前显示图片的https链接
      urls:b // 需要预览的图片https链接列表
    })
  },
  label_select(label){
    var src=this.data.images_srcs
    var labels=this.data.labels
    var temp_src=[]
    var j=0;
    var k
    let temp_view_src = "images_view_srcs"
    if(label=='全部'){
      this.setData({
        [temp_view_src]: this.data.images_srcs
      })
      return;
    }
    console.log(labels)
    console.log(labels.length)
    for(var i=0; i<labels.length; i++){
      if(labels[i]==undefined) continue;
      for(k=0;k<labels[i].length;k++){
        if(labels[i][k].name==label){
          temp_src[j]=src[i];
          j++;
          break;
        }
      }
    }
    console.log("111",labels.length)
    this.setData({
      [temp_view_src]: temp_src
    })
  },
  selected(){
    var i;
    var delete_selected_temp=[]
    var can_delete_selected_temp=[]
    let temp_select_text = "select_text"
    let temp_button_select = "button_select"
    let temp_delete_selected = "delete_selected"
    let temp_can_delete_selected="can_delete_selected"
    let temp_all_select="all_select"
    let temp_select_number="select_number"
    if(this.data.button_select==false){
      for(i=0;i<this.data.delete_selected.length;i++){
        can_delete_selected_temp[i]=true
        delete_selected_temp[i]=false
      }
      this.setData({
        clickcolor:"rgb(218, 214, 214)",
        color: "rgb(218, 214, 214)",
        [temp_all_select]:"全选",
        [temp_select_number]:"已选择0张图片",
        [temp_button_select]:true,
        [temp_select_text]:"取消",
        [temp_can_delete_selected]:can_delete_selected_temp,
        [temp_delete_selected]:delete_selected_temp
      })

    }
    else{
      for(i=0;i<this.data.delete_selected.length;i++){
        can_delete_selected_temp[i]=false
        delete_selected_temp[i]=false
      }
      this.setData({
        clickcolor:"red",
        color: "black",
        [temp_all_select]:"",
        [temp_select_number]:"",
        [temp_button_select]:false,
        [temp_select_text]:"选择",
        [temp_can_delete_selected]:can_delete_selected_temp,
        [temp_delete_selected]:delete_selected_temp
      })
    }
  },
  more_information(e){
    let _this=this
    console.log(e)
     wx.showActionSheet({
       itemList: ['还原至我的收藏'],//显示的列表项
          success: function (res) {//res.tapIndex点击的列表项
             console.log("点击了列表项：" ,_this.data.expression[e.currentTarget.dataset.index])
             var temp_expression=[]
             var i
             for(i=0;i<_this.data.delete_selected.length;i++){
               if(i!=e.currentTarget.dataset.index){
                 temp_expression[temp_expression.length]=_this.data.expression[i]
               }
             }
             wx.cloud.callFunction({
               name:"recycle_add_expression",
               data:{
                 id:app.globalData.open_id,
                 expression:_this.data.expression[e.currentTarget.dataset.index]
               },
               success(res){
                wx.cloud.callFunction({
                  name:"del_recycle",
                  data:{
                    id:app.globalData.open_id,
                    expression:temp_expression
                  },
                  success(res){
                    wx.showToast({
                      title: '还原成功',
                      icon: 'success',
                      duration: 1000,
                      success(data) {
                        setTimeout(function () {
                          wx.reLaunch({url: './index'})
                        }, 1000) //延迟时间
                      }
                    })
                  }
                })
               }
             })
             
            wx.showToast({
              title: '还原中',
              icon: 'loading',
              duration: 10000000
            })
          },
          fail: function (res) { },
          complete:function(res){ }
     });
   },
  delete(){
    var i;
    var temp_expression=[]
    for(i=0;i<this.data.delete_selected.length;i++){
      if(this.data.delete_selected[i]!=true){
        temp_expression[temp_expression.length]=this.data.expression[i]
      }
    }
    console.log("1111111111",temp_expression)
    wx.cloud.callFunction({
      name:"del_recycle",
      data:{
        id:app.globalData.open_id,
        expression:temp_expression
      }
    })
    wx.showToast({
      title: '删除成功',
      icon: 'loading',
      duration: 1000,
      success(data) {
        setTimeout(function () {
          wx.reLaunch({url: './index'})
        }, 1000) //延迟时间
      }
    })
  },
  all_select(){
    var i;
    let temp_delete_selected="delete_selected"
    var delete_seleted_temp=[]
    let temp_all_select="all_select"
    let temp_select_number="select_number"
    if(this.data.all_select=='全选'){
      for(i=0;i<this.data.delete_selected.length;i++){
        delete_seleted_temp[i]=true
      }
      this.setData({
        [temp_delete_selected]:delete_seleted_temp,
        [temp_select_number]:"已选择"+this.data.images_view_srcs.length+"张图片",
        [temp_all_select]:"全不选"
      })
    }
    else{
      for(i=0;i<this.data.delete_selected.length;i++){
        delete_seleted_temp[i]=false
      }
      this.setData({
        [temp_delete_selected]:delete_seleted_temp,
        [temp_select_number]:"已选择0张图片",
        [temp_all_select]:"全选"
      })
    }
  }
})
