import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
const createNew = async(req, res, next) => {
  try {
    // Điều hướng dữ liệu sang service > xử lý logic
    const createBoard = await boardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) {
    next(error)
  }
}
const getDetails = async(req, res, next) => {
  try {
    const boardId = req.params.id
    const result = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
export const boardController = {
  createNew,
  getDetails
}