import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { BOARD_COLLECTION_NAME } from '~/models/boardModel'
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title:Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false)
})


const validateBeforeCreate = async(data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}
const createNew = async(data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId (validData.boardId),
      columnId: new ObjectId (validData.columnId)
    }
    const createdCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
    return createdCard
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
// hàm push 1 giá trị cardId vào cuối mảng cardOrderIds
const pushCardOrderIds = async(column) => {
  try {
    const existingBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(column._id) })
    if (!existingBoard) {
      const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
        { _id:column.boardId },
        { $push: { columnOrderIds: new ObjectId(column._id) } },
        { returnDocument: 'after' }
      )
      return result.value
    } else {
      return `This column has id ${column._id} already pushed into columnOrderIds`
    }
  } catch (error) {
    throw new Error(error)
  }
}
export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds
}