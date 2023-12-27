/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_BD, CLOSE_DB } from '~/config/mongodb'
import 'dotenv/config'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
const START_SERVER = () => {
  const app = express()
  // xử lý cors
  app.use(cors(corsOptions))
  // cho phép nhận req.body bằng json từ fe
  app.use(express.json())
  app.use('/v1', APIs_V1)

  //middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)
  // môi trường Production support render.com
  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(`Hello I am running production at ${ process.env.POR }/`)
    })
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`Hello Luong Tran Dev, I am running at ${ env.LOCAL_DEV_APP_HOST }:${ env.LOCAL_DEV_APP_PORT }/`)
    })
  }

  //thực hiện cleanup trước khi dừng server lại
  exitHook(() => {
    CLOSE_DB()
  })
}
(async() => {
  try {
    await CONNECT_BD()
    START_SERVER()
  } catch (error) {
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
