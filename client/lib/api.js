const config = require('./api-config')
const QQ_MAP_KEY = config.QQ_MAP_KEY

wx.cloud.init({
  env: 'dev-1997db'
})

/**
 *
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
