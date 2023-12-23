import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
// define collection (name & schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title:Joi.string().required().min(3).max(50).trim().strict(),
  slug:Joi.string().required().min(3).trim().strict(),
  description:Joi.string().required().min(3).max(255).trim().strict(),
  type:Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  // lưu ý các items trong mảng columnorderids là objectid nên cần thêm pattern cho chuẩn cấu trúc
  columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false)
})
// chỉ định ra những fields mà chúng ta không muốn cho phép cập nhật trong hàm update()
const INVALID_UPDATE_FILEDS = ['_id', 'createdAt']
const validateBeforeCreate = async(data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}
const createNew = async(data) => {
  try {
    const validData = await validateBeforeCreate(data)
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
// query (aggregate query tổng hợp) để lấy toàn bộ column và card thuộc về board
const getDetails = async(boardId) => {
  try {
    // const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(boardId) })
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId(boardId),
        _destroy: false
      } },
      { $lookup:{
        from:columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
      {
        $lookup:{
          from:cardModel.CARD_COLLECTION_NAME,
          localField:'_id',
          foreignField:'boardId',
          as:'cards'
        }
      }
    ]).toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}
// hàm push 1 giá trị columnId vào cuối mảng columnOrderIds
const pushColumnOrderIds = async(column) => {
  try {
    const existingBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(column._id) })
    if (!existingBoard) {
      const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
        { _id:column.boardId },
        { $push: { columnOrderIds: new ObjectId(column._id) } },
        { returnDocument: 'after' }
      )
      return result
    } else {
      return `This column has id ${column._id} already pushed into columnOrderIds`
    }
  } catch (error) {
    throw new Error(error)
  }
}

const update = async(boardId, updateData) => {
  try {
    // lọc những field không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FILEDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    if ( updateData.columnOrderIds ) {
      updateData.columnOrderIds = updateData.columnOrderIds.map((_id) => (new ObjectId(_id)) )
    }
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result

  } catch (error) {
    throw new Error(error)
  }
}
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update
}