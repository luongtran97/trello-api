import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async(req, res, next ) => {
  const correctCondition = Joi.object({
    title:Joi.string().required().min(3).max(50).trim().strict(),
    description:Joi.string().required().min(3).max(255).trim().strict()
  })
  try {
    // abortEarly : false trường hợp có nhiều lỗi validation thì trả về tất cả
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    //Validate dữ liệu xong, hợp lệ thì cho request đi tiếp sang Controller
    next()
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: new Error(error).message })
  }
}
export const boardValidation = {
  createNew
}

