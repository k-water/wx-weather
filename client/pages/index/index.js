Page({
  data: {
    backgroundImage: '../../images/cloud.jpg',
    backgroundColor: '#62aadc',
    "air": {
      "status": 0,
      "aqi": "77",
      "color": "#00cf9a",
      "name": "良"
    },
    "current": {
      "backgroundImage": "https://tianqi-1d3bf9.tcb.qcloud.la/bg/day/overcast.jpg",
      "backgroundColor": "#5c7a93",
      "temp": "35",
      "wind": "南风",
      "windLevel": "1",
      "weather": "阴",
      "humidity": "73",
      "icon": "yin",
      "ts": "2018-08-12 14:54"
    },

    "today": {
      "temp": "24/30°",
      "icon": "leizhenyu",
      "weather": "雷阵雨"
    },
    "tomorrow": {
      "temp": "24/30°",
      "icon": "leizhenyu",
      "weather": "雷阵雨"
    },
    // 24小时天气数据
    "hourlyData": [{
        "temp": "29",
        "time": "16:00",
        "weather": "雷阵雨",
        "icon": "leizhenyu"
      }
      // ...
    ],
    // 一周天气数据
    "weeklyData": [{
        "day": "雷阵雨",
        "dayIcon": "leizhenyu",
        "dayWind": "南风",
        "dayWindLevel": "1-2",
        "maxTemp": "30",
        "minTemp": "24",
        "night": "中雨",
        "nightIcon": "zhenyuye",
        "nightWind": "南风",
        "nightWindLevel": "1-2",
        "time": 1534032000000
      }
      // ...
    ],
    // 生活指数
    "lifeStyle": [{
        "name": "舒适度", // 指数名称
        "icon": "guominzhishu", // 指数对应的icon图标type
        "info": "较不舒适", // 指数数值
        // 指数的详情
        "detail": "白天虽然有雨，但仍无法削弱较高气温带来的暑意，同时降雨造成湿度加大会您感到有些闷热，不很舒适。"
      }
      // ...
    ]
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})
