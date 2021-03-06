// pages/view-cluster/view-cluster.js

var utils = require('../../utils/utils');
var server = require('../../utils/server');

const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    cluster: null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      cluster: JSON.parse(options.cluster)
    });
    console.log(this.data.cluster);
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    const getRoot = function (record) {
      if (record.record.previous == null) {
        return record.id;
      }
      return getRoot(app.globalData.records.find((r) => r.id == record.record.previous));
    }

    let root = this.data.cluster.root;
    let records = [];
    for (let record of app.globalData.records) {
      if (getRoot(record) == root.id) {
        records.push(record);
      }
    }
    this.data.cluster.records = records;
    this.setData({
      cluster: this.data.cluster
    });
  },

  /** 点击某条记录：正常-跳转；选择模式-选择 */
  onTapItem: async function (e) {
    let record = e.detail.record;
    if (record.reserved == 'examination') {
      console.log(record);
      wx.navigateTo({
        url: '../view-examination/view-examination?record=' + JSON.stringify(record),
      });
    }
    else {
      wx.navigateTo({
        url: '../logs/logs?record=' + JSON.stringify(record),
      });
    }
  },

  onNew: function (e) {
    wx.showActionSheet({
      itemList: ['新建就诊记录', '新建检查报告'],
      success: (res) => {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../upload/upload?previous=' + e.detail.id
          });
        }
        else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: '../upload-examination/upload-examination?previous=' + e.detail.id
          });
        }
      }
    });
  },

  onShare: function (e) {
    app.globalData.selectedRecords = e.detail.ids;
    wx.navigateTo({
      url: '../gen-qrcode/gen-qrcode',
    });
  },

  onDelete: async function (e) {
    let fail = 0;
    let success = [];
    console.log(e.detail.ids);
    for (let id of e.detail.ids) {
      try {
        await server.deleteRecord(app.globalData.token, id);
        success.push(id);
      }
      catch (e) {
        fail++;
      }
    }
    if (fail > 0) {
      utils.showToast(`${fail}个病历删除失败，请重试`);
    }

    app.globalData.records = app.globalData.records.filter((record) => !success.includes(record.id));
    this.data.cluster.records = this.data.cluster.records.filter((record) => !success.includes(record.id));
    this.setData({
      cluster: this.data.cluster
    });
  },
})