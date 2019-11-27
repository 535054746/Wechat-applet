// pages/shop/shop.js
const app = getApp();
var host = require('../../utils/http.js')
var ajax = require('../../utils/requestUtil.js')
var myUtil = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    wheight: 0,//窗口高度
    cartList: [],//购物车商品列表
    categoryList: '',//商品分类列表
    itemList: [],//商品列表
    curCategoryId: '',//当前选中的商品分类,
    userInfo: '' //缓存中的用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var than = this
    console.log(than.data.itemList)
    than.data.cartList = wx.getStorageSync('cartList');
    if(myUtil.isEmpty(than.data.cartList)){
      than.data.cartList = [];
    }else{
      wx.setTabBarBadge({
        index: 1,
        text: ''+than.data.cartList.length,
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        than.setData({
          wheight: res.windowHeight
        })
      },
    })
  },

  viewImg(e) {
    var img = e.currentTarget.dataset.img
    wx.previewImage({
      urls: [img],
    })
  },

  getItemCategoryList() {
    var than = this
    ajax.ajaxPOST({
      url: 'member/mallItemProgram/findMallItemProgramCategory',
      success(res) {
        wx.stopPullDownRefresh()
        if(res.code == 1) {
          if (res.data.length != 0) {
            if (myUtil.isEmpty(than.data.curCategoryId)) {
              var id = res.data[0].categoryid;
              than.setData({
                categoryList: res.data,
                curCategoryId: id
              });
            } else {
              than.setData({
                categoryList: res.data,
              });
            }
            than.getItemList();
          }  else {
            
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }
    })
  },

  getItemList() {
    var than = this
    var cartList = this.data.cartList;
    ajax.ajaxPOST({
      url: 'member/mallItemProgram/findMallItemProgramDetails',
      data: {
        categoryId: than.data.curCategoryId
      },
      success(res) {
        console.log(res)
        if(res.code == 1){
          for(let item of res.data){
            if (cartList.length != 0) {
              for (let cartItem of cartList) {
                if (item.id == cartItem.id) {
                  item.qty = cartItem.qty;
                  break;
                } else {
                  item.qty = 0;
                }
              }
            } else {
              item.qty = 0;
            }
          }
        }else{

        }
        than.setData({
          itemList: res.data
        })
      },
      showLoading: !0
    })
  },

  leftNav: function(e) {
    this.setData({
      curCategoryId: e.currentTarget.dataset.id
    });
    this.getItemList();
  },
  

  onItemChange: function (e) {
    if (myUtil.isEmpty(this.data.userInfo)) {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    } else {
    //获取当前商品的下标
    const index = e.currentTarget.dataset.index;
    //获取当前商品的id
    const id = e.currentTarget.dataset.id;
    //获取当前商品的数量
    var qty = e.detail;
    var itemList = this.data.itemList;
    var cartList = this.data.cartList;
    itemList[index].qty = qty;
    this.data.itemList = itemList;
    var cartIndex = 0;
    var isExistCart = false;
    if (cartList.length != 0) {
      for (var item of cartList) {
        if (item.id == id) {
          item.qty = qty;
          isExistCart = true;
          break;
        }
        cartIndex++;
      }
    }
    if (qty <= 0){
      cartList.splice(cartIndex, 1);
    }else{
      if(isExistCart == false){
        cartList.push(itemList[index]);
        wx.showToast({
          title: '已加入购物车',
          duration: 500
        })
      }
    }
    wx.setStorage({
      key: 'cartList',
      data: cartList,
    })
    if(cartList.length == 0){
      wx.removeTabBarBadge({
        index: 1,
      })
    } else {
      wx.setTabBarBadge({
        index: 1,
        text: ''+cartList.length,
      })
    }
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
    // 获取最新的购物车的信息
    var than = this
    var cartList = wx.getStorageSync('cartList');
    var itemList = than.data.itemList;
    if (myUtil.isEmpty(cartList)){
      cartList = [];
      wx.removeTabBarBadge({
        index: 1,
      });
    }else{
      wx.setTabBarBadge({
        index: 1,
        text: ''+cartList.length,
      });
    }
    than.data.cartList = cartList;
    than.getItemCategoryList();
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        than.setData({
          userInfo: res.data
        })
      },
    })
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
    this.getItemCategoryList()
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