// pages/addressList/addressList.js
const app = getApp();
const ajax = require("../../utils/requestUtil.js");
const myUtil = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    mode: 0,
    checkedId: undefined
  },

  getAddressList: function(){
    var vm = this;
    ajax.ajaxPOST({
      url: 'member/userShippingAddress/findUserShippingAddressList',
      success: function(data){
        console.log(data)
        if(data.code == 1){
          for(var item of data.data){
            if(item.id == vm.data.checkedId){
              item.checked = true;
              break;
            }
          }
          vm.setData({
            addressList: data.data
          })
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none'
          });
        }
      },
      fail: function(xml){
      },
      showLoading: !0
    });
  },

  editItem: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/newAddress/newAddress?id='+id,
    })
  },

  addAddress: function(){
    wx.navigateTo({
      url: '/pages/newAddress/newAddress',
    })
  },

  selectItem: function(e){
    var index = e.currentTarget.dataset.index;
    var checked = e.currentTarget.dataset.checked;
    var tempList = this.data.addressList;
    var i = 0;
    for(var item of tempList){
      if(i == index)
        this.data.checkedId = item.id;
      item.checked = (i == index);
      i++;
    }
      if (this.data.mode != 0) {
        for (var item of this.data.addressList) {
          if (item.checked == true) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.setData({
              address: item,
              addressChild: item
            })
            wx.navigateBack({    
            });
            break;
          }
        }
      }
    this.setData({
      addressList: tempList
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mode = myUtil.isEmpty(options.mode) ? 0 : options.mode
    this.setData({
      mode: mode,
      checkedId: options.checkedId
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
    this.getAddressList();
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
    // if(this.data.mode != 0){
    //   for(var item of this.data.addressList){
    //     if(item.checked == true){
    //       console.log(item)
    //       var pages = getCurrentPages();
    //       var prevPage = pages[pages.length-2];
    //       console.log(prevPage)
    //       prevPage.setData({
    //         address: item,
    //         addressChild: item
    //       })
    //       break;
    //     }
    //   }
    // }
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