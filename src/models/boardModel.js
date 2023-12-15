import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { GET_DB } from '~/config/mongodb'
// define collection (name & schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title:Joi.string().required().min(3).max(50).trim().strict(),
  slug:Joi.string().required().min(3).trim().strict(),
  description:Joi.string().required().min(3).max(255).trim().strict(),

  // lưu ý các items trong mảng columnorderids là objectid nên cần thêm pattern cho chuẩn cấu trúc
  columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false)
})
const validateBeforeCreate = async(data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}
const createNew = async(data) => {
  try {
    const validData = await validateBeforeCreate(data)
    console.log('🚀 ~ validData:', validData)
    const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    return createdBoard
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById
}