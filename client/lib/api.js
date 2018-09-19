wx.cloud.init({
  env: 'dev'
})

export const test = () => {
  return wx.cloud.callFunction({
    name: 'test',
    data: {
      a: 1,
      b: 2
    }
  })
}
