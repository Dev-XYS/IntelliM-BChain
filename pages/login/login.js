var utils = require('../../utils/utils');
var server = require('../../utils/server');
var PR = require('../../utils/promisify');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: null,
    password: null,
    usercode: null,
    isPassword: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

  },

  bindUsernameChange: function (e) {
    this.setData({
      username: e.detail.value
    });
  },

  bindPasswordChange: function (e) {
    this.setData({
      password: e.detail.value
    });
  },

  /**
   * 点击账号密码登录
   */
  accountLogin: async function () {
    console.log('---login via account---');
    try {
      let token = await server.login(this.data.username, this.data.password, null);
      app.globalData.token = token;
      utils.showToast('登录成功', 'success');
      wx.reLaunch({ // 关闭login页面并打开index页面
        url: '../index/index',
      });
    } catch (e) {
      utils.showToast(e);
    }
  },

  /**
   * 点击注册--跳转至注册页面
   */
  signUp: async function () {
    wx.navigateTo({
      url: '../signup/signup'
    });
  },

  /**
   * 点击微信一键登录
   */
  wechatLogin: async function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.wxLogin(); // 微信登录
  },

  /**
   * 微信登录
   */
  wxLogin: async function () {
    try {
      let res = await PR.login();
      console.log('---login via wechat---');
      console.log(res.code);
      if (res.code) {
        try {
          let token = await server.login(null, null, res.code);
          app.globalData.token = token;
          utils.showToast('登录成功', 'success');
          wx.reLaunch({ // 关闭login页面并打开index页面
            url: '../index/index',
          });
        } catch (e) {
          throw e;
        }
      }
    } catch (e) {
      utils.showToast(e);
    }
  },

  showPassword: function () {
    this.setData({
      isPassword: !this.data.isPassword
    })
  },

})