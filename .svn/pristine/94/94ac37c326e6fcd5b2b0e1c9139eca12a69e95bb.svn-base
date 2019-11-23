//index.js
//获取应用实例
const app = getApp();
const myUtil = require('../../utils/util.js');

Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    userid:'',
    step: 1
  },
  //事件处理函数
  onLoad: function () {
    var than = this
    var userid =wx.getStorageSync('uid')
    var uInfo = wx.getStorageSync('userInfo');
    than.setData({
      userid: userid
    })
      // wx.login({
      //   success(res) {
      //     if (res.code) {
      //       wx.request({
      //         url: app.globalData.host + 'api/wechat/getOpenId',
      //         data: {
      //           code: res.code
      //         },
      //         method: 'POST',
      //         success(res) {
      //           if (res.data.code == 1) {
      //             if (res.data.data.loginid == null || res.data.data.loginid == undefined || res.data.data.loginid == '') {
      //               than.setData({
      //                 step: 1
      //               })
      //             } else {
      //               console.log(res)
      //               app.globalData.uid = res.data.data.userid;
      //               app.globalData.lid = res.data.data.loginid;
      //               wx.setStorageSync('uid', res.data.data.userid)
      //               wx.setStorageSync('lid', res.data.data.loginid)
      //               if (myUtil.isEmpty(app.globalData.userInfo)) {
      //                 than.setData({
      //                   step: 2
      //                 })
      //               } else {
      //                 wx.switchTab({
      //                   url: '/pages/me/me',
      //                 })
      //               }
      //             }
      //           }
      //         }
      //       })
      //     }
      //   }
      // })

        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            wx.setStorage({
              key: 'userInfo',
              data: res.userInfo,
            })
            wx.switchTab({
              url: '/pages/me/me',
            })
          }, fail: res => {
          }
      })
  },


  cancel() {
    wx.switchTab({
      url: '/pages/me/me',
    })
  },
  getUserInfo: function (e) {
    var than = this
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo,
      })
      wx.switchTab({
        url: '/pages/me/me',
      })
    }
  },

  getPhoneNumber(e) {
    var than =this
    var openid = wx.getStorageSync('openid')
    var sesskey = wx.getStorageSync('sesskey')
    if (e.detail.errMsg == "getPhoneNumber:ok") {
        than.setData({
          phone: true
        })
        wx.showLoading({
          title: '登录中',
        });
      wx.request({
        url: app.globalData.host +'api/wechat/xzxapplet/login',
        data: {
          openid: openid,
          encrypted_data: e.detail.encryptedData,
          iv: e.detail.iv,
          session_key: sesskey
        },
        method: 'POST',
        success(res) {
          wx.hideLoading();
          if (res.data.code == 1) {
            app.globalData.uid = res.data.data.userid;
            app.globalData.lid = res.data.data.loginid;
            wx.setStorageSync('uid', res.data.data.userid)
            wx.setStorageSync('lid', res.data.data.loginid)
            than.setData({
              step: 2
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '快捷登录失败，请重新点击进行登录！',
              showCancel: !1
            })
          }
        },
        fail: function (xml) {
          wx.showModal({
            title: '提示',
            content: '网络异常，请检查后重新点击进行登录！',
            showCancel: !1
          })
          wx.hideLoading()
        }
      })
    } 
  }
})
