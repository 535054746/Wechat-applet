// pages/search/search.js
var host = require('../../utils/http.js')
const app = getApp();
var ajax = require('../../utils/requestUtil.js')
var myUtil = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showKeywords: false,
    value: '',
    shopList: '',
    cartList: [],
    shopStatus: false,
    history: [],
    stashop: false,
    errorMsg: '',//错误信息
  },

  inputTxt() {
    this.setData({
      value: '',
      shopStatus: false,
      showKeywords: false
    })
  },
  gwc() {
    wx.switchTab({
      url: '/pages/car/car',
    })
  },
  clearhistory() {
    var than = this
    wx.showModal({
      title: '提示',
      content: '确定清空历史搜索记录？',
      success(res) {
        if(res.confirm){
          wx.removeStorageSync('history');
          than.setData({history: []});
        }
      }
    })
  },
  
  keywordHandle(e) {
    const text = e.target.dataset.text;
    this.setData({
      value: text,
      showKeywords: true,
    })
    this.searBtn()
    this.historyHandle(text);
  },

  searchInput(e) {
    var than = this
    if (!e.detail.value) {
      than.setData({
        showKeywords: false,
        shopStatus: false
      })
    } else {
      than.setData({
        showKeywords: true,
        value: e.detail.value,
      })
    }
  },

  searBtn(e) {
    var than = this
    var valTxt = than.data.value;
    if(!valTxt) {
      return false
    } else {
      ajax.ajaxPOST({
        url:'member/mallItemProgram/findMallItemProgramDetails',
        data: {
          name: valTxt
        },
        success(res) {
          if(res.code == 1){
            if (res.data.length != 0) {
              var shopList = res.data;
              var cartList = than.data.cartList;
              for(var shopItem of shopList){
                for(var cartItem of cartList){
                  if(shopItem.id == cartItem.id){
                    shopItem.qty = cartItem.qty;
                    break;
                  }else{
                    shopItem.qty = 0;
                  }
                }
              }
              than.setData({
                shopList: shopList,
                shopStatus: true,
                stashop: false
              })
            }else{
              var errorMsg = '未搜索到与“' + valTxt + '”相关的品项'
              than.setData({
                stashop: true,
                errorMsg: errorMsg
              })
            }
          }else{
            than.data.errorMsg = res.message;
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        },
        fail(data) {
          than.data.errorMsg = '搜索失败，请重试'
          wx.showToast({
            title: '搜索失败，请重试',
            icon: 'none'
          })
        },
        showLoading: !0,
        loadingText: '正在搜索...'
      })
    }
   than.historyHandle(valTxt)
  },

  historyHandle(value) {
    let history = this.data.history;
    const idx = history.indexOf(value);
    if (idx === -1) {
      if (history.length > 7) {
        history.pop();
      }
    } else {
      history.splice(idx, 1);
    }
    history.unshift(value);
    wx.setStorageSync('history', JSON.stringify(history));
    this.setData({
      history: history
    });
  },

  viewImg(e) {
    var img = e.currentTarget.dataset.img
    wx.previewImage({
      urls: [img],
    })
  },

  onItemChange: function (e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    var qty = e.detail;
    var itemList = this.data.shopList;
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
    if (qty <= 0) {
      cartList.splice(cartIndex, 1);
    } else {
      if (isExistCart == false) {
        wx.showToast({
          title: '已加入购物车',
          duration: 500
        })
        cartList.push(itemList[index]);
      }
    }
    wx.setStorage({
      key: 'cartList',
      data: cartList,
    })
    if (cartList.length == 0) {
      wx.removeTabBarBadge({
        index: 1,
      })
    } else {
      wx.setTabBarBadge({
        index: 1,
        text: '' + cartList.length,
      })
    }
    this.setData({cartList: cartList})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const history = wx.getStorageSync('history');
    if (history) {
      this.setData({
        history: JSON.parse(history)
      })
    }
    var cartList = wx.getStorageSync('cartList')
    if (myUtil.isEmpty(cartList)) {
      cartList = [];
      wx.setStorageSync('cartList', [])
    }
    this.setData({
      cartList: cartList
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
})