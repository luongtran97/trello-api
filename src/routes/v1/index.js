import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'
const Router = express.Router()

// checlApi v1 status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message:'Apis v1 are ready to use' })
})
/** Board Api */
Router.use('/boards', boardRoute)
/** Card Api */
Router.use('/cards', cardRoute)
/** Column Api */
Router.use('/columns', columnRoute)
export const APIs_V1 = Router