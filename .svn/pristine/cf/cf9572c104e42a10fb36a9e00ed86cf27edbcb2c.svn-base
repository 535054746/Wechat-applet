
const ajax = require('../../../utils/requestUtil.js');
const myUtil = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '' ,//单据列表
    wheight: '',
    item: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var than = this;
    if (myUtil.isEmpty(options.id)) {
      wx.showModal({
        title: '提示',
        content: '获取物流信息失败！',
        showCancel: !1,
        success(res) {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
    } else {
      this.data.id = options.id;
    }
  },
  call(e) {
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: `${e.currentTarget.dataset.tel}`
    })
  },
  copy(e) {
    console.log(e.currentTarget.dataset.itme)
    wx.setClipboardData({
      data: e.currentTarget.dataset.itme,
      success(res) {
        wx.getClipboardData({
          success(res) {
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var than = this
    ajax.ajaxPOST({
      url: 'oms/omsSalesOrderLogistics/findOmsSalesOrderLogisticsBySalesOrderId',
      data: {
        id: this.data.id
      },
      success(res) {
        if(res.code ==1) {
          var list = res.data;
          list.forEach(item=>{
            item.logisticsTime = myUtil.formatTime(new Date(item.logisticsTime));
          });
          than.setData({
            item: res.data
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: res.errMsg,
          icon: 'none'
        })
      }
    })
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