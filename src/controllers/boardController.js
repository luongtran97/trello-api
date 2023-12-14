import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
const createNew = async(req, res, next) => {
  try {
    const createBoard = await boardService.createNew(req.body)
    // Điều hướng dữ liệu sang service > xử lý logic
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew
}