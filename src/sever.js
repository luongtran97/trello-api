import express from 'express'

const app = express()

// const hostname = 'localhost'
const port = 8080

app.get('/', function (req, res) {
  res.send('Hello mấy cưng!')
})

app.listen(port)
