/*<remove trigger="prod">*/
import {
  geocoder
} from '../../lib/api'
import {
  getWeather,
  getAir
} from '../../lib/api-mock'
/*</remove>*/

/*<jdists trigger="prod">
import { geocoder, getWeather, getAir} from '../../lib/api'
</jdists>*/
import {
  fixChart,
  getChartConfig,
  drawEffect
} from '../../lib/utils'
import Chart from '../../lib/chartjs/chart'

let effectInstance
let isUpdate = false
const EFFECT_CANVAS_HEIGHT = 768 / 2
const CHART_CANVAS_HEIGHT = 272 / 2
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

    //获取天气信息
    getWeather(lat, lon)
      .then((res) => {
        wx.hideLoading()
        if (typeof cb === 'function') {
          cb()
        }
        if (res.result) {
          this.render(res.result)
        } else {
          fail()
        }
      })
      .catch(fail)

    // 获取空气质量
    getAir(city)
      .then((res) => {
        if (res && res.result) {
          this.setData({
            air: res.result
          })
        }
      })
      .catch((e) => {})

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

    const pages = getCurrentPages() //获取加载的页面
    const currentPage = pages[pages.length - 1] //获取当前页面的对象
    const query = currentPage.options

    if (query && query.address && query.lat && query.lon) {
      this.setData({
          city,
          province,
          county,
          address,
          lat,
          lon
        },
        () => {
          this.getWeatherData()
        }
      )
    } else {
      this.getLocation()
    }

  },
  render(data) {
    isUpdate = true
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

    this.stopEffect()

    if (effect && effect.name) {
      effectInstance = drawEffect('effect', effect.name, width, EFFECT_CANVAS_HEIGHT * scale, effect.amount)
    }
    // 延时画图
    this.drawChart()
  },

  onPullDownRefresh() {
    // 页面相关事件处理函数--监听用户下拉动作
    this.getWeatherData(() => {
      wx.stopPullDownRefresh()
    })
  },


  onShareAppMessage() {
    // 用户点击右上角分享
    // 如果获取数据失败，则没有位置和天气信息，那么需要个默认文案
    if (!isUpdate) {
      return {
        title: '我发现一个好玩的天气小程序，分享给你看看！',
        path: '/pages/index/index'
      }
    } else {
      // 如果有天气信息，那么需要给 path 加上天气信息
      const {
        lat,
        lon,
        address,
        province,
        city,
        county
      } = this.data
      let url = `/pages/index/index?lat=${lat}&lon=${lon}&address=${address}&province=${province}&city=${city}&county=${county}`

      return {
        title: `「${address}」现在天气情况，快打开看看吧！`,
        path: url
      }
    }
  },

  stopEffect() {
    if (effectInstance && effectInstance.clear) {
      effectInstance.clear()
    }
  },

  drawChart() {
    const {
      width,
      scale,
      weeklyData
    } = this.data
    let height = CHART_CANVAS_HEIGHT * scale
    let ctx = wx.createCanvasContext('chart')
    fixChart(ctx, width, height)

    // 添加温度
    Chart.pluginService.register({
      afterDatasetsDraw(e, t) {
        ctx.setTextAlign('center')
        ctx.setTextBaseline('middle')
        ctx.setFontSize(16)

        e.data.datasets.forEach((t, a) => {
          let r = e.getDatasetMeta(a)
          r.hidden ||
            r.data.forEach((e, r) => {
              // 昨天数据发灰
              ctx.setFillStyle(r === 0 ? '#e0e0e0' : '#ffffff')

              let i = t.data[r].toString() + '\xb0'
              let o = e.tooltipPosition()
              0 == a ? ctx.fillText(i, o.x + 2, o.y - 8 - 10) : 1 == a && ctx.fillText(i, o.x + 2, o.y + 8 + 10)
            })
        })
      }
    })

    return new Chart(ctx, getChartConfig(weeklyData))
  }
})
