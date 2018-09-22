import Promise from './bluebird'

export const getWeather = (lat, lon) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:3000/api/he-weather',
      data: {
        lat,
        lon
      },
      success: (res) => {
        resolve({
          result: res.data
        })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

export const getAir = (city) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:3000/api/he-air',
      data: {
        city
      },
      success: (res) => {
        resolve({
          result: res.data
        })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

export const test = data => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:3000/api/test',
      data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: res => {
        resolve({
          result: res.data
        })
      },
      fail: e => {
        reject(e)
      },
    })
  })
}
