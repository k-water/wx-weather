const path = require('path')
const express = require('express')
const {
  PORT
} = require('../config.server.json')

const test = require('./cloud-functions/test/').main

const app = express()

app.use(
  '/static',
  express.static(path.join(__dirname, 'static'), {
    index: false,
    maxAge: '30d'
  })
)

app.get('/api/test', (req, res, next) => {
  test(req.query)
    .then(res.json.bind(res))
    .catch(e => {
      console.error(e)
      next(e)
    })
})

app.listen(PORT, () => {
  console.log(`server start successful: http://127.0.0.1:${PORT}`)
})
