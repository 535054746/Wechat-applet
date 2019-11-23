// pages/newAddress/newAddress.js
const ajax = require("../../utils/requestUtil.js");
const myUtil = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',//判断是新增还是编辑。0--新增,1--编辑
    region: [],//省份
    receiveName: '',//收货人
    moblie: '',//手机号
    address: '',//收货地址
    defaultAddress: 0//是否默认
  },

  onLoad: function(options){
    if (!myUtil.isEmpty(options.id)){
      this.getAddressDetail(options.id);
    }
    
  },
  getAddressDetail: function(id){
    var vm = this;
    ajax.ajaxPOST({
      url: 'member/userShippingAddress/findUserShippingAddressById',
      data: {id: id},
      success: function(data){
        if(data.code == 1){
          var detail = data.data;
          vm.getRegion(detail.address);
          vm.setData({
            id: id,
            receiveName: detail.name,
            moblie: detail.phone,
            region: vm.getRegion(detail.address),
            address: vm.getAddress(detail.address),
            defaultAddress: detail.status
          })
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      },
      showLoading: !0
    })
  },

  getRegion(fullAddress) {
    var tempRegion = [];
    var provinceIndex = fullAddress.indexOf('省') + 1;
    var cityIndex = fullAddress.indexOf('市') + 1;
    var districtIndex = fullAddress.indexOf('区') + 1;
    tempRegion.push(fullAddress.substring(0, provinceIndex));
    tempRegion.push(fullAddress.substring(provinceIndex, cityIndex));
    tempRegion.push(fullAddress.substring(cityIndex, districtIndex));
    return (tempRegion);
  },

  getAddress(fullAddress) {
    var districtIndex = fullAddress.indexOf('区') + 1;
    return (fullAddress.substring(districtIndex, fullAddress.length));
    
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  saveAddress: function () {
    if (myUtil.isEmpty(this.data.receiveName)) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      });
      return;
    }
    if (myUtil.isEmpty(this.data.moblie)) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      });
      return;
    }else{
      if(this.data.moblie.length != 11){
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        });
        return;
      }
    }
    if (this.data.region.length == 0) {
      wx.showToast({
        title: '请选择省份',
        icon: 'none'
      });
      return;
    }
    if (myUtil.isEmpty(this.data.address)) {
      wx.showToast({
        title: '请输入收货地址',
        icon: 'none'
      });
      return;
    }
    var address = this.data.region.join('') + this.data.address;
    var postData = {
      name: this.data.receiveName,
      phone: this.data.moblie,
      address: address,
      status: this.data.defaultAddress
    };
    var targetUrl;
    if(myUtil.isEmpty(this.data.id)){
      targetUrl = 'member/userShippingAddress/addUserShippingAddress';
    }else{
      targetUrl = 'member/userShippingAddress/modifyUserShippingAddress';
      postData.id = this.data.id;
    }
    ajax.ajaxPOST({
      url: targetUrl,
      data: postData,
      success: function(data){
        if(data.code == 1){
          wx.showToast({
            title: '保存成功',
          })
          setTimeout(function(){
            wx.navigateBack();
          }, 500)
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none'
          });
        }
      }
    });
  },

  bindInput: function(event){
    var name = event.currentTarget.id;
    this.data[name] = event.detail.value;
  },

  onCheckedChange: function(e){
    this.data.defaultAddress = (e.detail.value.length > 0) ? 1 : 0;
  },

  delAddress: function(){
    var vm = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址？',
      showCancel: !0,
      success(res){
        if(res.confirm){
          ajax.ajaxPOST({
            url: 'member/userShippingAddress/deleteUserShippingAddressById',
            data: {id: vm.data.id},
            success(data){
              if(data.code == 1){
                wx.showToast({
                  title: '删除成功'
                })
                setTimeout(function () {
                  wx.navigateBack();
                }, 500)
              }else{
                wx.showToast({
                  title: data.message,
                  icon: 'none'
                });
              }
            },
            fail(res) {
              wx.showToast({
                title: '请求失败',
                icon: 'none'
              });
            },
            showLoading: !0
          })
        }
      }
    })
  }
})