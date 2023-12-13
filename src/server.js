/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_BD, GET_DB, CLOSE_DB } from '~/config/mongodb'
import 'dotenv/config'
import { env } from '~/config/environment'

const START_SERVER = () => {

  const app = express()


  app.get('/', async (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hello Luong Tran Dev, I am running at ${ env.APP_HOST }:${ env.APP_PORT }/`)
  })

  //thực hiện cleanup trước khi dừng server lại
  exitHook(() => {
    console.log('exiting...')
    CLOSE_DB()
    console.log('exited')
  })
}
(async() => {
  try {
    console.log('Connecting to MongoBd Atlas!')
    await CONNECT_BD()
    console.log('Connected to MongoBd Atlas!')
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()

// khi kết nối thành công > start server backend lên
// CONNECT_BD()
//   .then(() => console.log('Connected to MongoBd Atlas!'))
//   .then(() => START_SERVER())
//   .catch((err) => {
//     console.log(err)
//     process.exit(0)
//   })
