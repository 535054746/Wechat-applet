// pages/me/order/order.js
const app = getApp();
var ajax = require('../../../utils/requestUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carr: '',
    content: '',
    shangla:true,
    xiala: true,
    emptData: false,
    orderjiaData :[
      {
        time: '2019-11-13 16:28:38',
        address: '北京天安门',
        price: '515',
        num: '3'
      },
      {
        time: '2019-11-13 16:28:38',
        address: '北京天安门',
        price: '515',
        num: '3'
      }, {
        time: '2019-11-13 16:28:38',
        address: '北京天安门',
        price: '515',
        num: '3'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var than = this
    than.setData({
      carr: options.status
    })
   than.orderData(options.status)
    
  },

  orderData(status) {
    var than = this
    ajax.ajaxPOST({
      url: '',
      data:{
        status: status,
        // page:page
      },
      success(res) {
        than.setData({
          content: res.data
        })
      }
    })
  },

  qunbu(e){
    var than = this
    than.setData({
      carr: e.currentTarget.dataset.index
    })
  }, 

  daizf(e) {
    var than = this
    than.setData({
      carr: e.currentTarget.dataset.index
    })
  }, 

  daifh(e) {
    var than = this
    than.setData({
      carr: e.currentTarget.dataset.index
    })
  }, 

  yifah(e) {
    var than = this
    than.setData({
      carr: e.currentTarget.dataset.index
    })
  }, 

  yiwc(e) {
    var than = this
    than.setData({
      carr: e.currentTarget.dataset.index
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
    var than = this  
    if(than.data.xiala) {
        wx.showNavigationBarLoading()
        setTimeout(()=>{
          than.setData({
            shangla: true
          })
        },1000)
      // ajax.ajaxPOST({
      //   url: '',
      //   data: {

      //   },
      //   success(res) {
      //     than.setData({
      //       content: res.data,
      //       shangla: false
      //     })
      //     wx.hideNavigationBarLoading()
      //     wx.stopPullDownRefresh()
      //   }
      // })
    }
    than.setData({
      shangla: false
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    var than = this
    if(than.data.shangla) {
    console.log('1')
      setTimeout(() =>{
        wx.showLoading({
          title: '加载中...',
        })
        than.setData({
          xiala: true
        })
      },1000)
      var page 
      page = page+ 1
      // ajax.ajaxPOST({
      //   url:'',
      //   data: {

      //   },
      //   success(res) {
      //     var content_list = than.data.content
      //     than.setData({
      //       content:content_list.concat(res.data),
      //       xiala: false
      //     })
      //     wx.hideLoading()
      //   }
      // })
    }
    than.setData({
      xiala: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})