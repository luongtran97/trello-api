import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'

const createNew = async(req, res, next ) => {
  const correctCondition = Joi.object({
    title:Joi.string().required().min(3).max(50).trim().strict(),
    description:Joi.string().required().min(3).max(255).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })
  try {
    // abortEarly : false trường hợp có nhiều lỗi validation thì trả về tất cả
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    //Validate dữ liệu xong, hợp lệ thì cho request đi tiếp sang Controller
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}
const update = async(req, res, next ) => {
  // lưu ý không dùng require() trong trường hợp update
  const correctCondition = Joi.object({
    title:Joi.string().min(3).max(50).trim().strict(),
    description:Joi.string().min(3).max(255).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
  })
  try {
    // abortEarly : false trường hợp có nhiều lỗi validation thì trả về tất cả
    await correctCondition.validateAsync(req.body, {
      abortEarly:false,
      // đối với trường hợp update cho phép unknow để không cần thiết đẩy một số field lên
      allowUnknown:true
    })
    //Validate dữ liệu xong, hợp lệ thì cho request đi tiếp sang Controller
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}
export const boardValidation = {
  createNew,
  update
}

