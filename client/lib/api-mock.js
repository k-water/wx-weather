import Promise from './bluebird'

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
