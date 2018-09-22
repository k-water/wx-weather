import {
  geocoder
} from '../../lib/api'
import {
  getWeather
} from '../../lib/api-mock'
Page({
  data: {
    backgroundImage: '../../images/cloud.jpg',
    backgroundColor: '#62aadc',
    statusBarHeight: 32,
    current: {
      temp: '0',
      weather: '数据获取中',
      humidity: '1',
      icon: 'xiaolian'
    },
    today: {
      temp: 'N/A',
      weather: '暂无'
    },
    tomorrow: {
      temp: 'N/A',
      weather: '暂无'
    },
    // hourlyData
    hourlyData: [],
    city: '北京',
    weeklyData: [],
    width: 375,
    scale: 1,
    address: '定位中',
    lat: 40.056974,
    lon: 116.307689
  },

  /**
   * 获取天气信息
   * @param {function} cb
   */
  getWeatherData(cb) {
    wx.showLoading({
      title: '获取数据中',
      mask: true
    })
    const fail = (e) => {
      wx.hideLoading()
      if (typeof cb === 'function') {
        cb()
      }
      wx.showToast({
        title: '加载失败，请稍后再试',
        icon: 'none',
        duration: 3000
      })
    }
    const {
      lat,
      lon,
      province,
      city,
      county
    } = this.data
    getWeather(lat, lon)
      .then((res) => {
        wx.hideLoading()
        if (typeof cb === 'function') {
          cb()
        }
        if (res.result) {
          console.log(res.result)
          this.render(res.result)
        } else {
          fail()
        }
      })
      .catch(fail)

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
  render(data) {
    const {
      width,
      scale
    } = this.data
    const {
      hourly,
      daily,
      current,
      lifeStyle,
      oneWord = '',
      effect
    } = data
    const {
      backgroundColor,
      backgroundImage
    } = current

    const _today = daily[0],
      _tomorrow = daily[1]
    const today = {
      temp: `${_today.minTemp}/${_today.maxTemp}°`,
      icon: _today.dayIcon,
      weather: _today.day
    }
    const tomorrow = {
      temp: `${_tomorrow.minTemp}/${_tomorrow.maxTemp}°`,
      icon: _tomorrow.dayIcon,
      weather: _tomorrow.day
    }

    this.setData({
      hourlyData: hourly,
      weeklyData: daily,
      current,
      backgroundImage,
      backgroundColor,
      today,
      tomorrow,
      oneWord,
      lifeStyle
    })
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
    this.getWeatherData(() => {
      wx.stopPullDownRefresh()
    })
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
