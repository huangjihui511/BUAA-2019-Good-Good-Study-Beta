//index.js
//删除
const db = wx.cloud.database()
const app = getApp()
function add(a,b){
return a+b
}
Page({
  data: {
    icon: [{ name: 'appreciate', isShow: true }, { name: 'check', isShow: true }, { name: 'close', isShow: true }, { name: 'edit', isShow: true }, { name: 'emoji', isShow: true }, { name: 'favorfill', isShow: true }, { name: 'favor', isShow: true }],
   
    expression_comment:[],
    expression_view_comment:[],
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
    expression:[],
    expression_view:[],
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
    clickcolor:"red",
    TabCur : 0,
    scrollLeft:0,
  },
  tabSelect(e) {
    if(this.data.button_select==true){
      return
    }
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
    if(this.data.TabCur==1){this.from_shop()}
    else if(this.data.TabCur==2){this.freq_order();}
    else{
      console.log(this.data.TabCur)
      this.label_select(this.data.navData[this.data.TabCur].text)
    }
    var singleNavWidth = 54;
    this.setData({
      scrollLeft: (this.data.TabCur - 2) * singleNavWidth
    })      
  },
  switchNav(event){
    var _this=this
    var k
    var cur = event.currentTarget.dataset.current;
    console.log(cur)
    for(k=0;k<this.data.navData.length;k++){
      let navdata="navData["+k+"].show"
      if(k!=cur){
        _this.setData({
          [navdata]:false
        })
      }
      else{
        _this.setData({
          [navdata]:true
        })
      }
    }
    console.log(this.data.navData) 
    var singleNavWidth = 64;
    this.setData({
        navScrollLeft: (cur - 2) * singleNavWidth
    })      
    if (this.data.currentTab == cur) {
        return false;
    } else {
        this.setData({
            currentTab: cur
        })
        if(cur==1){this.from_shop()}
        else if(cur==2){this.freq_order();}
        else{
          this.label_select(this.data.navData[cur].text)
        }
    }
  },
  from_shop(){
    var src=this.data.images_srcs
    var labels=this.data.labels
    var temp_src=[]
    var temp_expression=[]
    var temp_comment=[]
    var j=0;
    let temp_view_src = "images_view_srcs"
    for(var i=0; i<labels.length; i++){
      if((labels[i].length==2)&&(labels[i][1].name=="商店")) {
        temp_src[j]=src[i];
        temp_expression[j]=this.data.expression[i]
        temp_comment[j]=this.data.expression_comment[i]
        j++;
      }
    }
    this.setData({
      [temp_view_src]: temp_src,
      expression_view:temp_expression,
      expression_view_comment:temp_comment
    })
  },
  onShow: async function () {
    var that = this
    if (app.globalData.skin == "normal") {
        that.setSkinNormalTitle()
    } else {
        app.setSkinPinkTitle()
    }
    var _this=this
    console.log("1111",app.globalData.open_id)
    var res =await wx.cloud.callFunction({
      name:"get_label",
      data:{
        id:app.globalData.open_id,
      }
    })
    if(res.result.data[0].labels!=undefined){
      var i
      var j
      for(i=0;i<res.result.data[0].labels.length;i++){
        for(j=0;j<this.data.navData.length;j++){
          if(this.data.navData[j].text==res.result.data[0].labels[i]){
            break;
          }
        }
        if(j!=this.data.navData.length){
          continue
        }
        let navdata="navData["+this.data.navData.length+"]"
        _this.setData({
          [navdata]:({ text: res.result.data[0].labels[i],show:false})
        })
      }
    }
    var freq1=[];
    var label1=[];
    var images_src1=[];
    var delete_selected_temp=[];
    var can_delete_selected_temp=[];
    var expression_temp=[];
    var res = await wx.cloud.callFunction({
      name:"add_expression",
      data:{
        request:"get_set",
        data1:app.globalData.open_id,
      }
    })
    console.log(res)
    var num 
    if((res.result.data[0]==undefined)||(res.result.data[0].expression_set==undefined)){
      num=0
    }
    else{
      num = res.result.data[0].expression_set.length
    }
    for (var i = 0; i < num; i++) {
      expression_temp[i]=res.result.data[0].expression_set[i]
      freq1[i] = res.result.data[0].expression_set[i].times
      label1[i] = res.result.data[0].expression_set[i].tags
      images_src1[i] = res.result.data[0].expression_set[i].file_id
      delete_selected_temp[i]=false
      can_delete_selected_temp[i]=false
      wx.cloud.callFunction({
        name:"get_expression_only_for_team2",
        data:{
          data1:images_src1[i],
          data2:i,
        },
        success(res){
          console.log("111111111111111111111111110",res)
          
          let expp="expression_comment["+res.result[1]+"]"
          let expp1="expression_view_comment["+res.result[1]+"]"
          console.log(images_src1[res.result[1]])
          if((res.result[0].data[0]!=undefined)&&(res.result[0].data[0].comment!=undefined)){
            console.log("222")
            _this.setData({
              [expp]:res.result[0].data[0].comment,
              [expp1]:res.result[0].data[0].comment
            })
          }
          else{
            console.log("111")
            _this.setData({
              [expp]:[],
              [expp1]:[]
            })
          }
          console.log(i,"1000",_this.data.expression_comment)
        }
      })
    }
    
    console.log(images_src1)
    console.log("111111",expression_temp)
    let temp_view_src = "images_view_srcs"
    let temp_src = "images_srcs"
    let temp_label = "labels"
    let temp_freq="freqs"
    let temp_delete_selected="delete_selected"
    let temp_can_delete_selected="can_delete_selected"
    this.setData({
      expression:expression_temp,
      expression_view:expression_temp,
      [temp_view_src]: images_src1,
      [temp_src]: images_src1,
      [temp_label]: label1,
      [temp_freq]: freq1,
      [temp_delete_selected]: delete_selected_temp,
      [temp_can_delete_selected]:can_delete_selected_temp
    })
  },

  setSkinNormalTitle: function () {
    wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#20B2AA',
    })
  }, 
  
  freq_order(){
    var freq=this.data.freqs
    var src=this.data.images_srcs
    var expression=this.data.expression
    var label=this.data.labels
    var comment=this.data.expression_comment
    var k
    var temp
    for(var i=1; i<freq.length; i++){
      for(var j=0; j<freq.length-i; j++){
        if(freq[j]>freq[j+1]){
          freq[j]=[freq[j+1],freq[j+1]=freq[j]][0];
          src[j]=[src[j+1],src[j+1]=src[j]][0];
          expression[j]=[expression[j+1],expression[j+1]=expression[j]][0];
          comment[j]=[comment[j+1],comment[j+1]=comment[j]][0];
          temp=[]
          for(k=0;k<label[j].length;k++){
            temp[k]=label[j][k]
          }
          for(k=0;k<label[j+1].length;k++){
            label[j][k]=label[j+1][k]
          }
          for(k=0;k<temp.length;k++){
            label[j+1][k]=temp[k]
          }
        }
      }
     }
    let temp_view_src = "images_view_srcs"
    let temp_src = "images_srcs"
    let temp_label = "labels"
    let temp_freq="freqs"
    this.setData({
      [temp_src]: src,
      [temp_view_src]: src,
      [temp_label]: label,
      [temp_freq]: freq,
      expression_view:expression,
      expression_view_comment:comment
    })
    console.log("comment",this.data.expression_view_comment)
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
      
      /*wx.showToast({
        title: '长按图片可转发',
        icon: 'loading',
        duration: 1000
      })
      console.log(e.currentTarget.dataset.srcs)
      wx.previewImage({
        current: e.currentTarget.dataset.src, // 当前显示图片的https链接
        urls: e.currentTarget.dataset.srcs, // 需要预览的图片https链接列表
      })*/
      console.log(this.data.expression_view[e.currentTarget.dataset.index])
      wx.navigateTo({
        url: '../expression_information/index?expression='+this.data.images_view_srcs[e.currentTarget.dataset.index],
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
    var temp_expression=[]
    var temp_comment=[]
    var j=0;
    var k
    let temp_view_src = "images_view_srcs"
    if(label=='全部'){
      this.setData({
        [temp_view_src]: this.data.images_srcs,
        expression_view:this.data.expression,
        expression_view_comment:this.data.expression_comment
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
          temp_expression[j]=this.data.expression[i]
          temp_comment[j]=this.data.expression_comment[i]
          j++;
          break;
        }
      }
    }
    console.log("111",labels.length)
    this.setData({
      [temp_view_src]: temp_src,
      expression_view:temp_expression,
      expression_view_comment:temp_comment
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
  add_or_delete(){
    wx.navigateTo({
      url: '../change_labels/index',
    })
  },
 more_information(e){
   let _this=this
   console.log(e)
    wx.showActionSheet({
      itemList: ['编辑','转发','保存图片','收藏到微信',"修改标签"],//显示的列表项
         success: function (res) {//res.tapIndex点击的列表项
            console.log("点击了列表项：" + res.tapIndex)
            if(res.tapIndex==0){
              console.log("000000000000")
              wx.reLaunch({
                url: '../../edit_functions/edit_functions?src='+e.currentTarget.dataset.src,
              })
            }
            else if(res.tapIndex==4){
              wx.navigateTo({
                url: '../change_expression_labels/index?src=' + e.currentTarget.dataset.src,
              })
            }
            else{
              console.log("111111111")
              _this.forward(e.currentTarget.dataset.src,e.currentTarget.dataset.srcs)
            }
         },
         fail: function (res) { },
         complete:function(res){ }
    });
  },
  delete(){
    var i;
    for(i=0;i<this.data.delete_selected.length;i++){
      if(this.data.delete_selected[i]==true){
        console.log("1111",this.data.expression_view[i])
        wx.cloud.callFunction({
          name:"recycle",
          data:{
            id:app.globalData.open_id,
            recycles:this.data.expression_view[i]
          }
        })
        //调用云函数删除
        wx.cloud.callFunction({
          name:"add_expression",
          data:{
            request:"sub_expression",
            data1:app.globalData.open_id,
            data2:this.data.images_view_srcs[i]
          }
        })
        console.log("删除"+i)
        console.log(this.data.images_view_srcs[i])
      }
    }
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
