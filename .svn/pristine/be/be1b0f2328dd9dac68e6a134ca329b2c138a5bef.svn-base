// pages/car/car.js
const app = getApp();
const ajax = require("../../utils/requestUtil.js");
const myUtil = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    selectAllStatus: false,
    totalCount: 0,
    totalMoney: 0,
    userInfo: '' //获取缓存中的用户信息
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
    this.getTotalPrice()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var than = this 
    var cartList = wx.getStorageSync('cartList')
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        than.setData({
          userInfo: res.data
        })
      },
    })
    this.data.cartList = cartList;
    if(cartList.length == 0 ){
      wx.hideTabBarRedDot({
        index: 1,
      })
      this.setData({
        cartList: cartList
      })
      this.getTotalPrice();
    } else {
      this.getNewestItemDetail();
      wx.setTabBarBadge({
        index: 1,
        text: `${cartList.length}`
      })
    }
  },

  // 删除商品
  carDel() {
    var than = this
    console.log(than.data.totalCount)
    if(than.data.totalCount==0) {
      wx.showToast({
        title: '您尚未选择商品',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否删除商品',
        success(res){
          if(res.confirm) {
            var cartList = than.data.cartList.filter(item => item.isSelect !== true )
            than.setData({ 
              cartList: cartList,
              totalMoney: 0,
              selectAllStatus: false,
              totalCount: 0
            })
            wx.setStorage({
              key: 'cartList',
              data: cartList,
            })
            wx.setTabBarBadge({
              index: 1,
              text: `${than.data.cartList.length}`
            })
            if(than.data.cartList.length == 0 ) {
              wx.hideTabBarRedDot({
                index: 1,
              })
            }
          } else if(res.cancel) {
            return false
          }
        }
      })
    }
  },


  getNewestItemDetail(){
    var cartList = this.data.cartList;
    var ids = [];
    cartList.forEach(item=>{
      ids.push(item.id);
    });
    var vm = this;
    ajax.ajaxPOST({
      url: 'member/mallItemProgram/findMallItemProgramDetailsByIds',
      data: {id: ids.join()},
      success(data){
        if(data.code == 1){
          vm.setQtyForItem(data.data);
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      },
      fail(data) {
        wx.showToast({
          title: '获取最新商品信息失败',
          icon: 'none'
        })
      },
      showLoading: !0,
    })
  },

  //从服务器返回的最新商品信息配上数量
  setQtyForItem(itemList) {
    var vm = this;
    var cartList = this.data.cartList;
    //如果服务器没有商品，代表商品都已下架，需要清空缓存里的购物车信息
    if (itemList.length == 0) {
      wx.removeStorageSync('cartList');
      this.setData({
        cartList: []
      });
      wx.removeTabBarBadge({
        index: 1,
      });
      wx.showModal({
        title: '提示',
        content: '购物车的商品已下架，暂时无法购买！',
        showCancel: !1
      });
      return;
    }
    //已下架的商品列表
    var saleOutList = [];
    //判断服务器返回来的商品数量是否跟购物车的商品数量一致
    if (itemList.length != cartList.length) {
      for (var cartItem of cartList) {
        //是否在itemList中存在该品项
        var isExist = false;
        for (var item of itemList) {
          if (item.id == cartItem.id) {
            isExist = true;
            item.qty = cartItem.qty;
            item.isSelect = cartItem.isSelect;
            break;
          }
        }
        //不存在就存到saleOutList中删除缓存购物车对应的商品
        if (!isExist) {
          saleOutList.push(cartItem);
        }
      }

      if (saleOutList.length != 0) {
        var saleOutTxt = [];
        saleOutList.forEach(item=>{
          saleOutTxt.push(item.itemName);
        });
        //更新缓存的购物车信息
        wx.setStorage({
          key: 'cartList',
          data: itemList,
        });
        wx.showModal({
          title: '提示',
          content: saleOutTxt.join() + '已下架，暂时无法购买！',
          showCancel: !1
        });
      }
    } else {
      for (var item of itemList) {
        for (var cartItem of cartList) {
          if (item.id == cartItem.id) {
            item.qty = cartItem.qty;
            item.isSelect = cartItem.isSelect;
            break;
          }
        }
      }
    }
    //渲染页面
    this.setData({
      cartList: itemList
    });
    if (itemList.length == 0) {
      wx.removeTabBarBadge({
        index: 1,
      });
    } else {
      wx.setTabBarBadge({
        index: 1,
        text: '' + itemList.length,
      })
    }
    this.getTotalPrice();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorageSync('cartList', this.data.cartList)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  // 单选
  bindCheckbox: function (e) {
    var than = this;
    const index = e.currentTarget.dataset.index;
    let cartList = than.data.cartList;
    const isSelect1 = cartList[index].isSelect;
    cartList[index].isSelect = !isSelect1;
    than.setData({
      cartList: cartList,
      selectAllStatus: false
    });
    than.getTotalPrice()
  },

   
  // 全选
  bindSelectAll:function() {
    var than = this;
    let cartList = than.data.cartList;
    let selectAllStatus = than.data.selectAllStatus
    selectAllStatus = !selectAllStatus
    for(let i = 0; i<cartList.length; i++) {
      cartList[i].isSelect = selectAllStatus
    }
    than.setData({
      cartList: cartList,
      selectAllStatus: selectAllStatus
    })
    than.getTotalPrice()
  },


  // 计算金额
  getTotalPrice:function() {
    var than = this
    var cartList = than.data.cartList
    let total = 0
    let count = cartList.length;
    var selectedCount = 0;
    for(var i = 0 ;i<cartList.length;i++) {
      if(cartList[i].isSelect) {
        total += cartList[i].qty * cartList[i].unitPrice
        selectedCount++;
      }
    }
    var selectAllStatus;
    if(cartList.length == 0){
      selectAllStatus = false;
    }else{
      selectAllStatus = (selectedCount == cartList.length);
    }
    than.setData({
      cartList: cartList,
      totalCount: selectedCount,
      totalMoney: total.toFixed(2) / 100,
      selectAllStatus: selectAllStatus
    })
  },

  bindjiesuan() {
    var selectedList = [];
    var selectedId = [];
      for(var item of this.data.cartList){
        if(item.isSelect){
          selectedList.push(item);
          selectedId.push(item.id);
        }
      }
      //缓存选择结算的商品
      wx.setStorageSync('selectShop', selectedList);
      wx.navigateTo({
        url: '/pages/mallorder/mallorder?ids='+selectedId.join(),
      })
  },

  onItemChange(e) {
    var vm = this;
    var cartList = this.data.cartList;
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    var qty = e.detail;
    var cartIndex = 0;
    if (cartList.length != 0) {
      for (var item of cartList) {
        if (item.id == id) {
          item.qty = qty;
          break;
        }
        cartIndex++;
      }
    }
    if (qty == 0) {
      cartList.splice(cartIndex, 1);

      wx.showModal({
        title: '提示',
        content: '您确定删除该商品吗？',
        success(res){
          if (res.confirm) {
            vm.setData({
              cartList: cartList
            })
            if (cartList.length == 0) {
              wx.removeTabBarBadge({
                index: 1,
              });
              vm.getTotalPrice();
            } else {
              wx.setTabBarBadge({
                index: 1,
                text: '' + cartList.length,
              });
              vm.getTotalPrice();
            }
          }
        }
      })
    }else{
      this.setData({
        cartList: cartList
      })
      this.getTotalPrice();
    }
  },
})