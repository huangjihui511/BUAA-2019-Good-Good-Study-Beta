// miniprogram/pages/fliter_new/fliter_new.js

const ImageFilters = require('../../utils/weImageFilters/weImageFilters.js')
const Helper = require('../../utils/weImageFilters/weImageFiltersHelper.js')

var helper = null

const filters = {
  original: function (data) {
      return data
  },
  Binarize: function (data) {
      // Binarize (srcImageData, threshold)
      // threshold 0.0 <= n <= 1.0
      return ImageFilters.Binarize(data, 0.5)
  },
  /*BoxBlur: function (data) {
      // BoxBlur (srcImageData, hRadius, vRadius, quality)

      return ImageFilters.BoxBlur(data, 3, 3, 2)
  },*/
  GaussianBlur: function (data) {
      // GaussianBlur (srcImageData, strength)
      // strength 1 <= n <= 4
      return ImageFilters.GaussianBlur(data, 4)
  },
  /*StackBlur: function (data) {
      // StackBlur (srcImageData, radius)

      return ImageFilters.StackBlur(data, 6)
  },*/
  Brightness: function (data) {
      // Brightness (srcImageData, brightness)
      // brightness - 100 <= n <= 100
      return ImageFilters.Brightness(data, 100)
  },
  /*BrightnessContrastGimp: function (data) {
      // BrightnessContrastGimp (srcImageData, brightness, contrast)
      // brightness - 100 <= n <= 100
      // contrast - 100 <= n <= 100
      return ImageFilters.BrightnessContrastGimp(data, 26, 13)
  },
  BrightnessContrastPhotoshop: function (data) {
      // ImageFilters.BrightnessContrastPhotoshop (srcImageData, brightness, contrast)
      // brightness - 100 <= n <= 100
      // contrast - 100 <= n <= 100
      return ImageFilters.BrightnessContrastPhotoshop(data, 26, 13)
  },
  Channels: function (data) {
      // ImageFilters.Channels (srcImageData, channel)
      // channel: default is red, 2 green, 3 blue

      return ImageFilters.Channels(data, 3)
  },
  ColorTransformFilter: function (data) {
      // ImageFilters.ColorTransformFilter (srcImageData, redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset)
      // redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier: 0~5
      // redOffset, greenOffset, blueOffset, alphaOffset: 0~255

      return ImageFilters.ColorTransformFilter(data, 2, 1, 1, 1, 38, 0, 0, 0)
  },
  Desaturate: function (data) {
      // ImageFilters.Desaturate (srcImageData)
      return ImageFilters.Desaturate(data)
  },*/
  Dither: function (data) {
      // ImageFilters.Dither (srcImageData, levels)
      // levels 2 <= n <= 255
      return ImageFilters.Dither(data, 2)
  },
  Edge: function (data) {
      // ImageFilters.Edge (srcImageData)
      return ImageFilters.Edge(data)
  },
  Emboss: function (data) {
      // ImageFilters.Emboss (srcImageData)
      return ImageFilters.Emboss(data)
  },
  /*Enrich: function (data) {
      // ImageFilters.Enrich (srcImageData)
      return ImageFilters.Enrich(data)
  },*/
  Flip: function (data) {
      // ImageFilters.Flip (srcImageData, vertical)
      // vertical{Boolean}
      return ImageFilters.Flip(data, 0)
  },
  /*Gamma: function (data) {
      // ImageFilters.Gamma (srcImageData, gamma)
      // gamma: 0~5
      return ImageFilters.Gamma(data, 5)
  },*/
  GrayScale: function (data) {
      // ImageFilters.GrayScale (srcImageData)
      return ImageFilters.GrayScale(data)
  },
  /*HSLAdjustment: function (data) {
      // ImageFilters.HSLAdjustment (srcImageData, hueDelta, satDelta, lightness)
      // hueDelta: 0~180
      // satDelta, lightness: 0~100
      return ImageFilters.HSLAdjustment(data, -23, 54, 19)
  },*/
  Invert: function (data) {
      // ImageFilters.Invert (srcImageData)
      return ImageFilters.Invert(data)
  },
  Mosaic: function (data) {
      // ImageFilters.Mosaic (srcImageData, blockSize)
      // blockSize > 0
      return ImageFilters.Mosaic(data, 10)
  },
  Oil: function (data) {
      // ImageFilters.Oil (srcImageData, range, levels)
      // range: 1~5
      // levels: 1~256
      return ImageFilters.Oil(data, 5, 62)
  },
  /*OpacityFilter: function (data) {
      // ImageFilters.OpacityFilter (srcImageData, opacity)
      // opacity: 0~255
      return ImageFilters.OpacityFilter(data, 123)
  },
  Posterize: function (data) {
      // ImageFilters.Posterize (srcImageData, levels)
      // levels: 2~32
      return ImageFilters.Posterize(data, 6)
  },
  Rescale: function (data) {
      // ImageFilters.Rescale (srcImageData, scale)
      // scale: 0~5
      return ImageFilters.Rescale(data, 3.2)
  },
  // ResizeNearestNeighbor: function (data) {
  //     // ImageFilters.ResizeNearestNeighbor (srcImageData, width, height)
  //     return ImageFilters.ResizeNearestNeighbor(data, 500, 500)
  // },
  Sepia: function (data) {
      // ImageFilters.Sepia(srcImageData)
      return ImageFilters.Sepia(data)
  },*/
  Sharpen: function (data) {
      // ImageFilters.Sharpen (srcImageData, factor)
      // factor: 1~10
      return ImageFilters.Sharpen(data, 9)
  },
  /*Solarize: function (data) {
      // ImageFilters.Solarize (srcImageData)
      return ImageFilters.Solarize(data)
  },
  Transpose: function (data) {
      // ImageFilters.Transpose (srcImageData)
      // factor: 1~10
      return ImageFilters.Transpose(data)
  },*/
  Twril: function (data) {
      // ImageFilters.Twril (srcImageData, centerX, centerY, radius, angle, edge, smooth)
      // centerX 0.0 <= n <= 1.0
      // centerY 0.0 <= n <= 1.0
      // radius
      // angle(degree)
      // smooth{Boolean}
      return ImageFilters.Twril(data, 0.5, 0.5, 120, 90, 0, true)
  },
}

const keys = Object.keys(filters)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cWidth: 0,
    cHeight: 600,
    array: [],
    index: 0,
    arrayname: ['原图','黑白','高斯模糊','亮度',
                '高频振动','边缘','浮雕','翻转','灰度','反相',
                '马赛克','油画','锐化','水波旋转']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages()
    var url = pages[pages.length-2].data.curImage
    let that = this
    wx.getImageInfo({
      src: url,
      success: function (res) {
        console.log(res.path)
        let width = wx.getSystemInfoSync().windowWidth
        var rate = res.height / res.width
        var height = 600 * width / 750
        if (res.width / res.height > 750 / 600) {
          height = Math.trunc(width * rate)
        } else {
          width = Math.trunc(height / rate)
        }
        that.setData({
          cWidth: width,
          cHeight: height,
          array: keys,
        })
        let ctx = wx.createCanvasContext('fliter')
        ctx.drawImage(res.path, 0, 0, width, height)
        ctx.draw(false, wx.canvasToTempFilePath({
          canvasId: 'fliter',
          success (res) {
            console.log(res.tempFilePath)
          }
        }))
        helper = new Helper({
          canvasId: 'fliterOut',
          width: width,
          height: height
        })
        helper.initCanvas(url)
      }
    })
  },

  bindPickerChange(e) {
    const z = this
    let index = e.detail.value
    this.setData({
        index
    })

    wx.showLoading({
        title: '正在加载...',
        mask: true
    })
    let imageData = helper.createImageData()
    let filtered = filters[keys[index]](imageData)

    helper.putImageData(filtered, () => {
        wx.hideLoading()
    })
  },

  onExport() {
    wx.canvasToTempFilePath({
      canvasId: 'fliterOut',
      success(res) {
        var pages = getCurrentPages()
        pages[pages.length-2].setData({
          curImage: res.tempFilePath
        })
        wx.showToast({
          title: '保存成功',
        })
      }
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