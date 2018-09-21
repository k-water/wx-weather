import {
  geocoder
} from '../../lib/api'

Page({
  data: {
    backgroundImage: '../../images/cloud.jpg',
    backgroundColor: '#62aadc',
    statusBarHeight: 32,
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

  /**
   * 处理逆地址
   * @param {*} lat
   * @param {*} lon
   * @param {*} name
   */
  getAddress(lat, lon, name) {
    wx.showLoading({
      title: '定位中',
      mask: true
    })

    let fail = e => {
      this.setData({
        address: name || '广州市天河区五山路华南农业大学'
      })
      wx.hideLoading()

      this.getWeatherData()
    }

    geocoder(
      lat,
      lon,
      res => {
        wx.hideLoading()
        let result = (res.data || {}).result

        if (res.statusCode === 200 && result && result.address) {
          let {
            address,
            formatted_addresses,
            address_component
          } = result

          if (formatted_addresses && (formatted_addresses.recommend || formatted_addresses.rough)) {
            address = formatted_addresses.recommend || formatted_addresses.rough
          }

          let {
            province,
            city,
            district: county
          } = address_component
          this.setData({
            province,
            county,
            city,
            address: name || address
          })

          this.getWeatherData()
        } else {
          fail()
        }
      },
      fail
    )

  },

  /**
   * 更新地址
   * @param {*} res
   */
  updateLocation(res) {
    let {
      latitude: lat,
      longitude: lon,
      name
    } = res
    let data = {
      lat,
      lon
    }
    if (name) {
      data.address = name
    }
    this.setData(data)
    this.getAddress(lat, lon, name)
  },

  /**
   * 获取经纬度
   */
  getLocation() {
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: this.updateLocation,
      fail: e => {
        this.openLocation()
      }
    })
  },

  /**
   * 打开地理位置授权
   */
  openLocation() {
    wx.showToast({
      title: '检测到您未授权使用位置权限，请先开启哦',
      icon: 'none',
      duration: 3000
    })
  },

  /**
   * 重新选择地理位置
   */
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        let {
          latitude,
          longitude
        } = res
        let {
          lat,
          lon
        } = this.data
        if (latitude == lat && lon == longitude) {
          this.getWeatherData()
        } else {
          this.updateLocation(res)
        }
      }
    })
  },

  getWeatherData() {

  },

  onLoad() {
    // 生命周期函数--监听页面加载
    wx.getSystemInfo({
      success: (res) => {
        let width = res.windowWidth
        let scale = width / 375
        this.setData({
          width,
          scale,
          paddingTop: res.statusBarHeight + 12
        })
      }
    })
    this.getLocation()
  },
  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow() {
    // 生命周期函数--监听页面显示
  },
  onHide() {
    // 生命周期函数--监听页面隐藏
  },
  onUnload() {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh() {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom() {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})
