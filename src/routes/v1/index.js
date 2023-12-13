import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from '~/routes/v1/boardRoutes'
const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message:'Apis v1 are ready to use' })
})
/** Board Api */
Router.use('/boards', boardRoutes)
export const APIs_V1 = Router