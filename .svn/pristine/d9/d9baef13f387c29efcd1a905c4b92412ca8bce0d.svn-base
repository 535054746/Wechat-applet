// pages/me/me.js
const app = getApp();
const ajax = require("../../utils/requestUtil.js");
const myUtil = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    badgeCount: {
      DFK: 0,
      DFH: 0,
      YFH: 0
    }
  },

  addressList: function(){
    if (myUtil.isEmpty(this.data.userInfo)) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/addressList/addressList',
      })
    }
  },

  //登录
  logon() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },


  contactHelp: function(){
    wx.makePhoneCall({
      phoneNumber: '13022320345',
    });
  },

  aboutUs: function(){
    wx.navigateTo({
      url: '/pages/aboutUs/aboutUs',
    })
  },
  
  viewImg: function(e){
    var vm = this;
    wx.previewImage({
      urls: [vm.data.userInfo.avatarUrl],
    })
  },

  goOrderList: function(event){
    var status = event.currentTarget.dataset.status;
    if (myUtil.isEmpty(this.data.userInfo)) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/orderList?status='+status,
      })
    }
  },

  getOrderStatus(){
    var vm = this;
    ajax.ajaxPOST({
      url: 'salesOrder/findLittleRedDot',
      success(data){
        if(data.code == 1){
          var count = {};
          for(var item of data.data){
            switch (item.status) {
              case 0:
                count.DFK = item.size;
                break;
              case 1:
                count.DFH = item.size;
                break;
              case 2:
                count.BFYH = item.size;
                break;
              case 3:
                count.YFH = item.size;
                break;
              case 4:
                break;
            }
          }
          vm.setData({
            badgeCount: count
          })
          wx.stopPullDownRefresh();
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      },
      fail(data) {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    var than =this
   wx.getStorage({
       key: 'userInfo',
      success: function(res) {
        than.setData({
          userInfo :res.data
        })
      },
    })
    console.log(than.data.userInfo)
    this.getOrderStatus();
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
    var vm = this;
    this.getOrderStatus();
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