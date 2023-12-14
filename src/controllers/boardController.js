import { StatusCodes } from 'http-status-codes'
const createNew = async(req, res, next) => {
  try {
    res.status(StatusCodes.CREATED).json({ message:'Note: Post from Controller' })
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew
}