import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async(reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)

    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    // ...
    if (getNewColumn) {
      // xử lý cấu trúc data ở đây trước khi trả dữ liệu về
      getNewColumn.cards = []

      // cập nhật lại mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) {
    throw error
  }

}
const update = async(columnId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)
    return updatedColumn
  } catch (error) { throw new Error(error) }
}
const deleteColumn = async(columnId) => {
  const targetColumn = await columnModel.findOneById(columnId)
  if (!targetColumn) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'COLUMN NOT FOUND')
  }
  try {
    // xóa column
    await columnModel.deleteColumn(columnId)
    // xóa toàn bộ cards thuộc column
    await cardModel.deteleManyCardsByColumnId(columnId)

    //  xóa columnId trong mảng columnOrderIds của Board chứa nó
    await boardModel.pullColumnOrderIds(targetColumn)
    return { deleteResult : 'Column and its Cards deleted successfully!' }
  } catch (error) {
    throw new Error(error)
  }
}
export const columnService = {
  createNew,
  update,
  deleteColumn
}