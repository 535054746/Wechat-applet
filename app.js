//app.js
App({
  onLaunch: function () {
    var vm = this;
    wx.checkSession({
      success() {
      },fail() {
        wx.login({
          success(res) {
          }
        })
      }
    })
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: vm.globalData.host +'api/wechat/xzxapplet/getOpenId',
            data: {
              code: res.code
            },
            method:'POST',
            success(res) {
              if (res.data.code == 1) {
                console.log(res)
                var openid = res.data.data.openid
                var sesskey = res.data.data.session_key
                var userid = res.data.data.userid
                wx.setStorageSync('openid', openid)
                wx.setStorageSync('sesskey', sesskey)
                  vm.globalData.uid = res.data.data.userid;
                  vm.globalData.lid = res.data.data.loginid;
                  wx.setStorageSync('uid', res.data.data.userid)
                  wx.setStorageSync('lid', res.data.data.loginid)
                }
            }
          })
        }
      }
    })

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    host: 'https://merchant.zgsuanzi.com/sz-api/',
    // host: 'http://192.168.1.245/sz-api/',
    carList: [],
    userInfo: null,
    call: null,
    appKey: 'wxApp-xzx',
    eid: '0A0E45F9E43C488FAFA6E0063A033976',  //须知香
    // eid: '6A32B879E8BE4908874FADE19446C0CB', //蒜子数据
    // eid:'91177C216DF1488F945B116E6933F97F',  //测试
    uid: '',
    lid: ''
  }
})