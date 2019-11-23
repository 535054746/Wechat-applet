const app = getApp();
const ajaxCustomer = options => {//自定义的参数：showLoading--是否显示等待动画  loadingText--等待动画的文字 loadingForbid--显示等待动画是否禁止操作
  if (options.url == undefined || options.url == null || options.url == '') {
    console.log('fail request cause url is emtry');
    return;
  }
  if (options.showLoading == true){
    wx.showLoading({
      title: options.loadingText||'',
      mask: options.loadingForbid||true
    });
  }

  var uid = wx.getStorageSync('uid');
  var lid = wx.getStorageSync('lid');
  
  wx.request({
    url: app.globalData.host+options.url,
    header: {
      appKey: app.globalData.appKey,
      eid: app.globalData.eid,
      uid: uid,
      lid: lid
    },
    dataType: options.dataType||'json',
    method: options.method||'GET',
    data: options.data,
    success: res => {
      if (options.showLoading == true) {
        wx.hideLoading();
      }
      if(res.statusCode >= 200 && res.statusCode < 300)
        typeof options.success == 'function' && options.success(res.data);
      else {
        console.log('fail request');
        console.log('statusCode:' + res.statusCode)
        console.log('data:' + res.data);
        typeof options.fail == 'function' && options.fail(res);
      }
    },
    fail: res => {
      if (options.showLoading == true) {
        wx.hideLoading();
      }
      typeof options.fail == 'function' && options.fail(res);
    },
    complete: res => {
    }
  })
}

const ajaxGET = options => {
  options.method = 'GET';
  ajaxCustomer(options);
}

const ajaxPOST = options => {
  options.method = 'POST';
  ajaxCustomer(options);
}

module.exports = {
  ajaxCustomer: ajaxCustomer,
  ajaxGET: ajaxGET,
  ajaxPOST: ajaxPOST
}