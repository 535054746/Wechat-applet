// pages/me/order/order.js
const app = getApp();
var ajax = require('../../utils/requestUtil.js');
var myUtil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '',//请求接口列表的状态值
    isLoading: false,//当前是否在请求接口中的标识
    hasNextPage: false,//是否有下一页
    pageNumber: 1,
    pageSize: 10,
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var than = this
    than.setData({
      status: options.status
    })
  },

  orderDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order/detail/orderDetail?id='+id,
    })
  },

  //点击tab栏请求接口
  selectStatus(e){
    if (!this.data.isLoading) {//如果真在请求接口就不再去请求了
      var status = e.currentTarget.dataset.status;
      this.setData({
        status: status
      })
      this.getOrderList(0);
    }
  },

  getOrderList(type){//0--下拉刷新   1--上拉加载
    var vm = this;
    if(type == 0){//判断请求接口类型，下拉刷新就初始化页码为1
      this.data.pageNumber = 1;
    } else {//上拉加载就页码++
      this.data.pageNumber++;
    }
    this.data.isLoading = true;//设置正在请求接口中的标识
    var postData = {
      status: this.data.status,
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize,
    };
    ajax.ajaxPOST({
      url: 'salesOrder/findSalesOrderList',
      data: postData,
      success(data){
        vm.data.isLoading = false;//设置请求接口完成的标识
        if(type == 0){
          wx.stopPullDownRefresh();
        }
        if(data.code == 1){
          for(var item of data.data.list){
            item.orderTime = myUtil.formatTime(new Date(item.orderTime));
          }
          var orderList = vm.data.orderList;
          if(type == 0){
            orderList = data.data.list;
          }else{
            orderList = orderList.concat(data.data.list);
          }
          vm.setData({
            orderList: orderList,
            hasNextPage: data.data.hasNextPage
          })
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
        wx.hideNavigationBarLoading();
      },
      fail(data) {
        vm.data.isLoading = false;
        if (type == 0) {
          wx.stopPullDownRefresh();
        }
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: data.message,
          icon: 'none'
        })

      },
      showLoading: !0
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
    this.getOrderList(0);
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
    var than = this
    if (!than.data.isLoading) {
      wx.showNavigationBarLoading();
      this.getOrderList(0);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    var than = this;
    if(!this.data.isLoading && this.data.hasNextPage){
      this.getOrderList(1);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})