// pages/web/web.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'http://merchant.zgsuanzi.com/sso-server/agreement'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type == 0){
      wx.setNavigationBarTitle({
        title: '蒜子商城隐私政策',
      });
    } else if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '蒜子商城用户协议',
      });
    }
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