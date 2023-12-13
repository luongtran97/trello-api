import { StatusCodes } from 'http-status-codes'

const createNew = async(req, res, next) => {
  try {
    console.log(req.body)
    res.status(StatusCodes.CREATED).json({ message:'Note: Post from Controller' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: error.message })
  }
}

export const boardController = {
  createNew
}