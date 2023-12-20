import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId : Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false)
})
const validateBeforeCreate = async(data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}
const createNew = async(data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newColumnToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId)
    }
    const createdColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd)
    return createdColumn
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
// hàm push 1 giá trị cardId vào cuối mảng cardOrderIds
const pushCardOrderIds = async(card) => {
  try {
    const existingColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(card._id) })
    if (!existingColumn) {
      const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
        { _id:card.columnId },
        { $push: { cardOrderIds: new ObjectId(card._id) } },
        { returnDocument: 'after' }
      )
      return result.value || null
    } else {
      return `This column has id ${card._id} already pushed into columnOrderIds`
    }
  } catch (error) {
    throw new Error(error)
  }
}
export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds
}