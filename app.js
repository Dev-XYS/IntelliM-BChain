var utils = require('./utils/utils');
var server = require('./utils/server');
var PR = require('./utils/promisify')

//app.js
App({
  globalData: {
    url: null,
    username: null,
    userInfo: null,
    token: null,
    records: [],
    baseInfo:null,
    selectedRecords: [],
  },

  onLaunch: async function () {},

  clearGlobalData: async function () {
    this.globalData.url = null;
    this.globalData.userInfo = null;
    this.globalData.token = null;
    this.globalData.records = null;
    this.globalData.baseInfo = null;
  },
})