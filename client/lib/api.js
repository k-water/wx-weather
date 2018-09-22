const config = require('./api-config')
const QQ_MAP_KEY = config.QQ_MAP_KEY

wx.cloud.init({
  env: 'dev-1997db'
})

const db = wx.cloud.database()

/**
 * 逆经纬度查询
 * @param {*} lat 经度
 * @param {*} lon 纬度
 * @param {*} success
 * @param {*} fail
 */
export const geocoder = (lat, lon, success = () => {}, fail = () => {}) => {
  return wx.request({
    url:  'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      location: `${lat},${lon}`,
      key: QQ_MAP_KEY,
      get_poi: 0
    },
    success,
    fail
  })
}

/**
 * 获取和风天气
 * @param {*} lat
 * @param {*} lon
 */
export const getWeather = (lat, lon) => {
  return wx.cloud.callFunction({
    name: 'he-weather',
    data: {
      lat,
      lon
    }
  })
}
/**
 * 获取和风空气质量
 * @param {*} city
 */
export const getAir = (city) => {
  return wx.cloud.callFunction({
    name: 'he-air',
    data: {
      city
    }
  })
}
