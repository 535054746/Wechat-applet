// pages/mallorder/mallorder.js
const ajax = require('../../utils/requestUtil.js');
const myUtil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ids: '',//要结算的商品id
    cartList: [],//购物车的商品信息
    address: undefined,//收货地址
    shopInfo: [],//接口返回的最新商品信息
    selectShop: [],//缓存里的商品信息
    totalAmount: 0,//总金额,
    addressChild: '',
    payType: 0,
  },

  checkboxChange(){
     var payType = 1;
    this.setData({
      payType: payType
    })
  },

  //跳转选择地址页面
  selectAddress:function() {
    var checkedId;
    if(!myUtil.isEmpty(this.data.address))
      checkedId = this.data.address.id;
    wx.navigateTo({
      url: "/pages/addressList/addressList?mode=1&checkedId="+checkedId
    })
  },

  //获取最新商品信息
  getOrderDetail(){
    var vm = this;
    var ids = this.data.ids;
    ajax.ajaxPOST({
      url: 'member/mallItemProgram/findMallItemProgramDetailsByIds',
      data: {id: ids},
      success(data){
        wx.stopPullDownRefresh();
        if(data.code == 1){
          vm.setQtyForItem(data.data);
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      },
      fail() {
        wx.stopPullDownRefresh();
      },
      showLoading: !0
    });
  },
  //从服务器返回的最新商品信息配上数量
  setQtyForItem(itemList) {
    var vm = this;
    var selectShopList = this.data.selectShop;
    //如果服务器没有商品，代表商品都已下架，需要清空缓存里的购物车信息，同时退出当前页面
    if(itemList.length == 0){
      wx.showModal({
        title: '提示',
        content: '您选择的商品都已下架，请重新选择商品',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.removeStorageSync('cartList');
            wx.navigateBack();
          }
        }
      })
      return;
    }
    var totalAmount = [];
    //已下架的商品列表
    var saleOutList = [];
    //判断服务器返回来的商品数量是否跟选择结算的商品数量一致
    if(itemList.length != selectShopList.length){
      for(var selectItem of selectShopList){
        //是否在itemList中存在该品项
        var isExist = false;
        for(var item of itemList){
          if(item.id == selectItem.id){
            isExist = true;
            item.qty = selectItem.qty;
            var amount = selectItem.qty * item.unitPrice / 100;
            item.amount = amount;
            totalAmount.push(new Number(amount));
            break;
          }
        }
        //不存在就存到saleOutList中删除缓存购物车对应的商品
        if(!isExist){
          saleOutList.push(selectItem);
        }
      }

      if (saleOutList.length != 0) {
        var cartList = this.data.cartList;
        var updateCartList = [];
        var saleOutTxt = [];
        for (var cartItem of cartList) {
          var isExist = false;
          for (var item of saleOutList) {
            if (cartItem.id == item.id) {
              isExist = true;
              saleOutTxt.push(item.itemName);
              break;
            }
          }
          if(!isExist){
            updateCartList.push(cartItem);
          }
        }
        //更新缓存的购物车信息
        wx.setStorage({
          key: 'cartList',
          data: updateCartList,
        });
        wx.showModal({
          title: '提示',
          content: saleOutTxt.join()+'已下架，暂时不能购买！',
        })
      }
    } else {
      for (var item of itemList) {
        for (var selectItem of selectShopList) {
          if (item.id == selectItem.id) {
            item.qty = selectItem.qty;
            var amount = ((selectItem.qty * item.unitPrice) / 100).toFixed(2);
            item.amount = amount;
            totalAmount.push(new Number(amount));
            break;
          }
        }
      }
    }
    this.setData({
      shopInfo: itemList,
      totalAmount: totalAmount.reduce(function(total, num){return total + num;}).toFixed(2)
    })

    this.getDefaultAddress();
  },


  viewImg(e) {
    var img = e.currentTarget.dataset.img
    wx.previewImage({
      urls: [img],
    })
  },

  
  //获取默认收货地址
  getDefaultAddress(){
    var vm = this;
    ajax.ajaxPOST({
      url: 'member/userShippingAddress/findDefaultUserShippingAddress',
      success(data){
        if(data.code == 1){
          if (myUtil.isEmpty(data.data)){
            
          }else{
            vm.setData({
              address: data.data
            })
          }
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      },
      fail(){
        
      },
      showLoading: !0
    })
  },

  //创建订单
  createOrder(e){
    var vm = this;
    if(myUtil.isEmpty(this.data.address)){
      wx.showModal({
        title: '提示',
        content: '请选择收货地址',
        success(res){
          if(res.confirm){
            vm.selectAddress();
          }
        }
      });
      return;
    }
    if(this.data.payType == 0){
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none'
      });
      return;
    }
    if(!vm.data.addressChild) {
      var postData = {
        receiptName: this.data.address.name,
        receiptAddress: this.data.address.address,
        receiptPhone: this.data.address.phone
      };
    } else {
      var postData = {
        receiptName: this.data.addressChild.name,
        receiptAddress: this.data.addressChild.address,
        receiptPhone: this.data.addressChild.phone
      };
    }

    var list = []
    for(var item of this.data.shopInfo){
      list.push({
        mallItemId: item.id,
        itemCode: item.itemCode,
        itemName: item.itemName,
        specifications: item.specification,
        orderQty: item.qty
      });
    }
    postData['salesOrderDetailList'] = list;
    ajax.ajaxPOST({
      url: 'salesOrder/saveSalesOrder',
      data: postData,
      success(data){
        if (data.code == 1) {
          vm.createSuccessDelCart(data.data);
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
      },
      showLoading: !0
    });
  },

  //创建订单成功后，购物车要删除掉下单成功的商品
  createSuccessDelCart(id) {
    var itemList = this.data.shopInfo;
    var cartList = this.data.cartList;
    var updateCartList = [];
    for (var cartItem of cartList) {
      var isExist = false;
      for (var item of itemList) {
        if (cartItem.id == item.id) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        updateCartList.push(cartItem);
      }
    }
    //更新缓存的购物车信息
    wx.setStorageSync('cartList', updateCartList);
    wx.redirectTo({
      url: '/pages/order/detail/orderDetail?id=' + id + '&payNow=1',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vm = this;
    this.data.ids = options.ids;
    if(!myUtil.isEmpty(options.ids)){
      //从缓存里面拿出选择结算的商品
      wx.getStorage({
        key: 'selectShop',
        success: function(res) {
          vm.data.selectShop = res.data;
        },
      })
      wx.getStorage({
        key: 'cartList',
        success: function(res) {
          vm.data.cartList = res.data;
        },
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '获取商品失败',
        showCancel: !1,
        success: function(res) {
          if(res.confirm){
            wx.navigateBack();
          }
        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderDetail();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开这个页面的时候要把缓存里的已选择结算的商品清空掉
    wx.removeStorage({key: 'selectShop'});
  },

  onPullDownRefresh(){
    this.getOrderDetail();
  }
})