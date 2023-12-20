import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
const createNew = async(req, res, next) => {
  try {
    // Điều hướng dữ liệu sang service > xử lý logic
    const createCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createCard)
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  createNew
}