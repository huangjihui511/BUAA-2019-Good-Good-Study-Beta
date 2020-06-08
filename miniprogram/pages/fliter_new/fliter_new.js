// miniprogram/pages/fliter_new/fliter_new.js

const ImageFilters = require('../../utils/weImageFilters/weImageFilters.js')
const Helper = require('../../utils/weImageFilters/weImageFiltersHelper.js')

var helper = null

var ConvolutionFilter = function(srcImageData, matrixX, matrixY, matrix, divisor, bias, preserveAlpha, clamp, color, alpha) {
  var srcPixels = srcImageData.data,
      srcWidth = srcImageData.width,
      srcHeight = srcImageData.height,
      //srcLength = srcPixels.length,
      //dstImageData = this.utils.createImageData(srcWidth, srcHeight),
      dstPixels = new Uint8ClampedArray(4 * srcWidth * srcHeight);
      //dstPixels = srcImageData.data;

    divisor = divisor || 1;
    bias = bias || 0;

    // default true
    (preserveAlpha !== false) && (preserveAlpha = true);
    (clamp !== false) && (clamp = true);

    color = color || 0;
    alpha = alpha || 0;

    var index = 0,
        rows = matrixX >> 1,
        cols = matrixY >> 1,
        clampR = color >> 16 & 0xFF,
        clampG = color >> 8 & 0xFF,
        clampB = color & 0xFF,
        clampA = alpha * 0xFF;

    for (var y = 0; y < srcHeight; y += 1) {
        for (var x = 0; x < srcWidth; x += 1, index += 4) {
            var r = 0,
                g = 0,
                b = 0,
                a = 0,
                replace = false,
                mIndex = 0,
                v;

            for (var row = -rows; row <= rows; row += 1) {
                var rowIndex = y + row,
                    offset;

                if (0 <= rowIndex && rowIndex < srcHeight) {
                    offset = rowIndex * srcWidth;
                } else if (clamp) {
                    offset = y * srcWidth;
                } else {
                    replace = true;
                }

                for (var col = -cols; col <= cols; col += 1) {
                    var m = matrix[mIndex++];

                    if (m !== 0) {
                        var colIndex = x + col;

                        if (!(0 <= colIndex && colIndex < srcWidth)) {
                            if (clamp) {
                                colIndex = x;
                            } else {
                                replace = true;
                            }
                        }

                        if (replace) {
                            r += m * clampR;
                            g += m * clampG;
                            b += m * clampB;
                            a += m * clampA;
                        } else {
                            var p = (offset + colIndex) << 2;
                            r += m * srcPixels[p];
                            g += m * srcPixels[p + 1];
                            b += m * srcPixels[p + 2];
                            a += m * srcPixels[p + 3];
                        }
                    }
                }
            }

            dstPixels[index] = (v = r / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
            dstPixels[index + 1] = (v = g / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
            dstPixels[index + 2] = (v = b / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
            dstPixels[index + 3] = preserveAlpha ? srcPixels[index + 3] : (v = a / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
        }
    }
    srcImageData.data = dstPixels
    return srcImageData;
};

var buildMap=function(f) {
  for (var m = [], k = 0, v; k < 256; k += 1) {
      m[k] = (v = f(k)) > 255 ? 255 : v < 0 ? 0 : v | 0;
  }
  return m;
};
var applyMap=function(src, dst, map) {
  for (var i = 0, l = src.length; i < l; i += 4) {
      dst[i] = map[src[i]];
      dst[i + 1] = map[src[i + 1]];
      dst[i + 2] = map[src[i + 2]];
      dst[i + 3] = src[i + 3];
  }
};
var mapRGB=function(src, dst, func) {
  applyMap(src, dst, buildMap(func));
};

const filters = {
  original: function (data) {
      return data
  },
  Binarize: function (data) {
      // Binarize (srcImageData, threshold)
      // threshold 0.0 <= n <= 1.0
      //return ImageFilters.Binarize(data, 0.5)
      let d = data.data;
      for (let i = 0; i < data.width * data.height;i++){
        //********************只有这里有区别****************************
          let R = d[i * 4 + 0];
          let G = d[i * 4 + 1];
          let B = d[i * 4 + 2];
          let grey = R * 0.3 + G * 0.59 + B * 0.11;
          if (grey > 125){
            grey=255;
          } else { 
            grey = 0;
          } 
          d[i * 4 + 0] = grey;
          d[i * 4 + 1] = grey;
          d[i * 4 + 2] = grey;
      }
      data.data = d;
      return data;
  },
  GaussianBlur: function (data) {
      // GaussianBlur (srcImageData, strength)
      // strength 1 <= n <= 4
      //return ImageFilters.GaussianBlur(data, 4)
      var size, matrix, divisor;
      size = 15;
      matrix = [
          2, 2, 3, 4, 5, 5, 6, 6, 6, 5, 5, 4, 3, 2, 2,
          2, 3, 4, 5, 7, 7, 8, 8, 8, 7, 7, 5, 4, 3, 2,
          3, 4, 6, 7, 9, 10, 10, 11, 10, 10, 9, 7, 6, 4, 3,
          4, 5, 7, 9, 10, 12, 13, 13, 13, 12, 10, 9, 7, 5, 4,
          5, 7, 9, 11, 13, 14, 15, 16, 15, 14, 13, 11, 9, 7, 5,
          5, 7, 10, 12, 14, 16, 17, 18, 17, 16, 14, 12, 10, 7, 5,
          6, 8, 10, 13, 15, 17, 19, 19, 19, 17, 15, 13, 10, 8, 6,
          6, 8, 11, 13, 16, 18, 19, 20, 19, 18, 16, 13, 11, 8, 6,
          6, 8, 10, 13, 15, 17, 19, 19, 19, 17, 15, 13, 10, 8, 6,
          5, 7, 10, 12, 14, 16, 17, 18, 17, 16, 14, 12, 10, 7, 5,
          5, 7, 9, 11, 13, 14, 15, 16, 15, 14, 13, 11, 9, 7, 5,
          4, 5, 7, 9, 10, 12, 13, 13, 13, 12, 10, 9, 7, 5, 4,
          3, 4, 6, 7, 9, 10, 10, 11, 10, 10, 9, 7, 6, 4, 3,
          2, 3, 4, 5, 7, 7, 8, 8, 8, 7, 7, 5, 4, 3, 2,
          2, 2, 3, 4, 5, 5, 6, 6, 6, 5, 5, 4, 3, 2, 2
      ];
      divisor = 2044;

      return ConvolutionFilter(data, size, size, matrix, divisor, 0, false);
  },
  Brightness: function (data) {
      // Brightness (srcImageData, brightness)
      // brightness - 100 <= n <= 100
      //return ImageFilters.Brightness(data, 100)

      var srcPixels = data.data;
      let srcHeight = data.height;
      let srcWidth = data.width;
      //var dstPixels = new Uint8ClampedArray(4 * srcWidth * srcHeight);
      var dstPixels = data.data;
      var brightness = 100;
      mapRGB(srcPixels, dstPixels, function(value) {
        value += brightness;
        return (value > 255) ? 255 : value;
      });
      data.data = dstPixels;
      return data;
  },
  Dither: function (data) {
      // ImageFilters.Dither (srcImageData, levels)
      // levels 2 <= n <= 255
      //return ImageFilters.Dither(data, 2)

      let srcHeight = data.height;
      let srcWidth = data.width;
      var dstPixels = data.data;
      var levels = 2;

      var posterize,
        levelMap = [],
        levelsMinus1 = levels - 1,
        j = 0,
        k = 0,
        i;

      for (i = 0; i < levels; i += 1) {
          levelMap[i] = (255 * i) / levelsMinus1;
      }

      posterize = buildMap(function(value) {
          var ret = levelMap[j];

          k += levels;

          if (k > 255) {
              k -= 255;
              j += 1;
          }

          return ret;
      });

      // Apply the dithering algorithm to each pixel
      var x, y,
          index,
          old_r, old_g, old_b,
          new_r, new_g, new_b,
          err_r, err_g, err_b,
          nbr_r, nbr_g, nbr_b,
          srcWidthMinus1 = srcWidth - 1,
          srcHeightMinus1 = srcHeight - 1,
          A = 7 / 16,
          B = 3 / 16,
          C = 5 / 16,
          D = 1 / 16;

      for (y = 0; y < srcHeight; y += 1) {
          for (x = 0; x < srcWidth; x += 1) {
              // Get the current pixel.
              index = (y * srcWidth + x) << 2;

              old_r = dstPixels[index];
              old_g = dstPixels[index + 1];
              old_b = dstPixels[index + 2];

              // Quantize using the color map
              new_r = posterize[old_r];
              new_g = posterize[old_g];
              new_b = posterize[old_b];

              // Set the current pixel.
              dstPixels[index] = new_r;
              dstPixels[index + 1] = new_g;
              dstPixels[index + 2] = new_b;

              // Quantization errors
              err_r = old_r - new_r;
              err_g = old_g - new_g;
              err_b = old_b - new_b;

              // Apply the matrix.
              // x + 1, y
              index += 1 << 2;
              if (x < srcWidthMinus1) {
                  nbr_r = dstPixels[index] + A * err_r;
                  nbr_g = dstPixels[index + 1] + A * err_g;
                  nbr_b = dstPixels[index + 2] + A * err_b;

                  dstPixels[index] = nbr_r > 255 ? 255 : nbr_r < 0 ? 0 : nbr_r | 0;
                  dstPixels[index + 1] = nbr_g > 255 ? 255 : nbr_g < 0 ? 0 : nbr_g | 0;
                  dstPixels[index + 2] = nbr_b > 255 ? 255 : nbr_b < 0 ? 0 : nbr_b | 0;
              }

              // x - 1, y + 1
              index += (srcWidth - 2) << 2;
              if (x > 0 && y < srcHeightMinus1) {
                  nbr_r = dstPixels[index] + B * err_r;
                  nbr_g = dstPixels[index + 1] + B * err_g;
                  nbr_b = dstPixels[index + 2] + B * err_b;

                  dstPixels[index] = nbr_r > 255 ? 255 : nbr_r < 0 ? 0 : nbr_r | 0;
                  dstPixels[index + 1] = nbr_g > 255 ? 255 : nbr_g < 0 ? 0 : nbr_g | 0;
                  dstPixels[index + 2] = nbr_b > 255 ? 255 : nbr_b < 0 ? 0 : nbr_b | 0;
              }

              // x, y + 1
              index += 1 << 2;
              if (y < srcHeightMinus1) {
                  nbr_r = dstPixels[index] + C * err_r;
                  nbr_g = dstPixels[index + 1] + C * err_g;
                  nbr_b = dstPixels[index + 2] + C * err_b;

                  dstPixels[index] = nbr_r > 255 ? 255 : nbr_r < 0 ? 0 : nbr_r | 0;
                  dstPixels[index + 1] = nbr_g > 255 ? 255 : nbr_g < 0 ? 0 : nbr_g | 0;
                  dstPixels[index + 2] = nbr_b > 255 ? 255 : nbr_b < 0 ? 0 : nbr_b | 0;
              }

              // x + 1, y + 1
              index += 1 << 2;
              if (x < srcWidthMinus1 && y < srcHeightMinus1) {
                  nbr_r = dstPixels[index] + D * err_r;
                  nbr_g = dstPixels[index + 1] + D * err_g;
                  nbr_b = dstPixels[index + 2] + D * err_b;

                  dstPixels[index] = nbr_r > 255 ? 255 : nbr_r < 0 ? 0 : nbr_r | 0;
                  dstPixels[index + 1] = nbr_g > 255 ? 255 : nbr_g < 0 ? 0 : nbr_g | 0;
                  dstPixels[index + 2] = nbr_b > 255 ? 255 : nbr_b < 0 ? 0 : nbr_b | 0;
              }
          }
      }
      data.data = dstPixels;
      return data;
      
  },
  Edge: function (data) {
      // ImageFilters.Edge (srcImageData)
      //return ImageFilters.Edge(data)
      return ConvolutionFilter(data, 3, 3, [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
  },
  Emboss: function (data) {
      // ImageFilters.Emboss (srcImageData)
      //return ImageFilters.Emboss(data)
      return ConvolutionFilter(data, 3, 3, [-2, -1, 0, -1, 1, 1,
        0, 1, 2
      ]);
  },
  Flip: function (data) {
      // ImageFilters.Flip (srcImageData, vertical)
      // vertical{Boolean}
      //return ImageFilters.Flip(data, 0)
      
      var srcPixels = data.data;
      let srcHeight = data.height;
      let srcWidth = data.width;
      var dstPixels = new Uint8ClampedArray(4 * srcWidth * srcHeight);
      //var dstPixels = data.data;
      var x, y, srcIndex, dstIndex, i;

      for (y = 0; y < srcHeight; y += 1) {
          for (x = 0; x < srcWidth; x += 1) {
              srcIndex = (y * srcWidth + x) << 2;
              dstIndex = (y * srcWidth + (srcWidth - x - 1)) << 2;

              dstPixels[dstIndex] = srcPixels[srcIndex];
              dstPixels[dstIndex + 1] = srcPixels[srcIndex + 1];
              dstPixels[dstIndex + 2] = srcPixels[srcIndex + 2];
              dstPixels[dstIndex + 3] = srcPixels[srcIndex + 3];
          }
      }
      data.data = dstPixels;
      return data;
  },
  GrayScale: function (data) {
      // ImageFilters.GrayScale (srcImageData)
      //return ImageFilters.GrayScale(data)
      let d = data.data;
      for (let i = 0; i < data.width * data.height;i++){
        //********************只有这里有区别****************************
          let R = d[i * 4 + 0];
          let G = d[i * 4 + 1];
          let B = d[i * 4 + 2];
          let grey = R * 0.3 + G * 0.59 + B * 0.11;
          d[i * 4 + 0] = grey;
          d[i * 4 + 1] = grey;
          d[i * 4 + 2] = grey;
      }
      data.data = d;
      return data;
  },
  Invert: function (data) {
      // ImageFilters.Invert (srcImageData)
      //return ImageFilters.Invert(data)
      let d = data.data;
      for (let i = 0; i < data.width * data.height;i++){
        //********************只有这里有区别****************************
          let R = d[i * 4 + 0];
          let G = d[i * 4 + 1];
          let B = d[i * 4 + 2];
          d[i * 4 + 0] = 255 - R;
          d[i * 4 + 1] = 255 - G;
          d[i * 4 + 2] = 255 - B;
      }
      data.data = d;
      return data;
  },
  Mosaic: function (data) {
      // ImageFilters.Mosaic (srcImageData, blockSize)
      // blockSize > 0
      //return ImageFilters.Mosaic(data, 10)
      let d = data.data;
      const size = 10;
      const totalnum = size*size;
      for(let i=0;i<data.height;i+=size){
        for(let j=0;j<data.width;j+=size){
          var totalR=0,totalG=0,totalB=0;
          for(let dx=0;dx<size;dx++){
            for(let dy=0;dy<size;dy++){
              var x = i+dx;
              var y = j+dy;
              var p = x * data.width + y;
              totalR += d[p * 4 + 0];
              totalG += d[p * 4 + 1];
              totalB += d[p * 4 + 2];
            }
          }
          var p = i * data.width + j;
          var resR = totalR / totalnum;
          var resG = totalG / totalnum;
          var resB = totalB / totalnum;
          for (let dx = 0; dx < size; dx++){
            for (let dy = 0; dy < size; dy++) {
              var x = i + dx;
              var y = j + dy;
              var p = x * data.width + y;
              d[p * 4 + 0] = resR;
              d[p * 4 + 1] = resG;
              d[p * 4 + 2] = resB;
            }
          }
        }
      }
      data.data = d;
      return data;
  },
  Oil: function (data) {
      // ImageFilters.Oil (srcImageData, range, levels)
      // range: 1~5
      // levels: 1~256
      //return ImageFilters.Oil(data, 5, 62)
      
      let srcHeight = data.height;
      let srcWidth = data.width;
      var dstPixels = new Uint8ClampedArray(4 * srcWidth * srcHeight);
      //var dstPixels = data.data;
      var srcPixels = data.data;

      var range = 5,levels = 62;
      var index = 0,
        rh = [],
        gh = [],
        bh = [],
        rt = [],
        gt = [],
        bt = [],
        x, y, i, row, col,
        rowIndex, colIndex, offset, srcIndex,
        sr, sg, sb, ri, gi, bi,
        r, g, b;

      for (y = 0; y < srcHeight; y += 1) {
          for (x = 0; x < srcWidth; x += 1) {
              for (i = 0; i < levels; i += 1) {
                  rh[i] = gh[i] = bh[i] = rt[i] = gt[i] = bt[i] = 0;
              }

              for (row = -range; row <= range; row += 1) {
                  rowIndex = y + row;

                  if (rowIndex < 0 || rowIndex >= srcHeight) {
                      continue;
                  }

                  offset = rowIndex * srcWidth;

                  for (col = -range; col <= range; col += 1) {
                      colIndex = x + col;
                      if (colIndex < 0 || colIndex >= srcWidth) {
                          continue;
                      }

                      srcIndex = (offset + colIndex) << 2;
                      sr = srcPixels[srcIndex];
                      sg = srcPixels[srcIndex + 1];
                      sb = srcPixels[srcIndex + 2];
                      ri = (sr * levels) >> 8;
                      gi = (sg * levels) >> 8;
                      bi = (sb * levels) >> 8;
                      rt[ri] += sr;
                      gt[gi] += sg;
                      bt[bi] += sb;
                      rh[ri] += 1;
                      gh[gi] += 1;
                      bh[bi] += 1;
                  }
              }

              r = g = b = 0;
              for (i = 1; i < levels; i += 1) {
                  if (rh[i] > rh[r]) {
                      r = i;
                  }
                  if (gh[i] > gh[g]) {
                      g = i;
                  }
                  if (bh[i] > bh[b]) {
                      b = i;
                  }
              }

              dstPixels[index] = rt[r] / rh[r] | 0;
              dstPixels[index + 1] = gt[g] / gh[g] | 0;
              dstPixels[index + 2] = bt[b] / bh[b] | 0;
              dstPixels[index + 3] = srcPixels[index + 3];
              index += 4;
          }
      }
      data.data = dstPixels;
      return data;
  },
  Sharpen: function (data) {
      // ImageFilters.Sharpen (srcImageData, factor)
      // factor: 1~10
      //return ImageFilters.Sharpen(data, 9)
      var factor = 9;
      return ConvolutionFilter(data, 3, 3, [-factor / 16, -factor / 8, -factor / 16, -factor / 8, factor * 0.75 + 1, -factor / 8, -factor / 16, -factor / 8, -factor / 16]);
  },
  Twril: function (data) {
      // ImageFilters.Twril (srcImageData, centerX, centerY, radius, angle, edge, smooth)
      // centerX 0.0 <= n <= 1.0
      // centerY 0.0 <= n <= 1.0
      // radius
      // angle(degree)
      // smooth{Boolean}
      //return ImageFilters.Twril(data, 0.5, 0.5, 120, 90, 0, true)
      //convert position to px
      let srcHeight = data.height;
      let srcWidth = data.width;
      var dstPixels = new Uint8ClampedArray(4 * srcWidth * srcHeight);
      //var dstPixels = data.data;
      var srcPixels = data.data;

      var centerX=0.5, centerY=0.5, radius=120, angle=90, edge=0, smooth=false;

      centerX = srcWidth * centerX;
      centerY = srcHeight * centerY;

      // degree to radian
      angle *= (Math.PI / 180);

      var radius2 = radius * radius,
          max_y = srcHeight - 1,
          max_x = srcWidth - 1,
          dstIndex = 0,
          x, y, dx, dy, distance, a, tx, ty, srcIndex, pixel, i;

      for (y = 0; y < srcHeight; y += 1) {
          for (x = 0; x < srcWidth; x += 1) {
              dx = x - centerX;
              dy = y - centerY;
              distance = dx * dx + dy * dy;

              if (distance > radius2) {
                  // out of the effected area. just copy the pixel
                  dstPixels[dstIndex] = srcPixels[dstIndex];
                  dstPixels[dstIndex + 1] = srcPixels[dstIndex + 1];
                  dstPixels[dstIndex + 2] = srcPixels[dstIndex + 2];
                  dstPixels[dstIndex + 3] = srcPixels[dstIndex + 3];
              } else {
                  // main formula
                  distance = Math.sqrt(distance);
                  a = Math.atan2(dy, dx) + (angle * (radius - distance)) / radius;
                  tx = centerX + distance * Math.cos(a);
                  ty = centerY + distance * Math.sin(a);

                  // copy target pixel
                  if (smooth) {
                      // bilinear
                      //this.utils.copyBilinear(srcPixels, tx, ty, srcWidth, srcHeight, dstPixels, dstIndex, edge);
                  } else {
                      // nearest neighbor
                      // round tx, ty
                      // TODO edge actions!!
                      srcIndex = ((ty + 0.5 | 0) * srcWidth + (tx + 0.5 | 0)) << 2;
                      dstPixels[dstIndex] = srcPixels[srcIndex];
                      dstPixels[dstIndex + 1] = srcPixels[srcIndex + 1];
                      dstPixels[dstIndex + 2] = srcPixels[srcIndex + 2];
                      dstPixels[dstIndex + 3] = srcPixels[srcIndex + 3];
                  }
              }

              dstIndex += 4;
          }
      }
      data.data = dstPixels;
      return data;
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