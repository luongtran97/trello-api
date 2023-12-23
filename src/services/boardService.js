import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { ObjectId } from 'mongodb'

const createNew = async(reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    // gọi tới tầng model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard)

    // lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án...
    // bắn email, notification về cho admin khi có 1 cái board mới được tạo..

    // trả kết quả về trong service bằng return
    return getNewBoard
  } catch (error) {
    throw error
  }

}

const getDetails = async(boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    // hàm clone deep tạo clone ra 1 mảng mới khi xử lý không ảnh hưởng đến mảng ban đầu
    const resBoard = cloneDeep(board)
    // đưa card về đúng colum
    resBoard.columns.forEach((column) => {
      // cách dùng .equals nằm trong mongodb có sẵn nó hiểu được Object id mà không cần convert
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))

      // sử dụng hàm toString() của js để convert ObjectId về string để so sánh
      // column.cards = resBoard.cards.filter((card) => card.columnId.toString() === column._id.toString())
    })
    delete resBoard.cards
    return resBoard
  } catch (error) {
    throw error
  }
}
const update = async(boardId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) { throw new Error(error) }
}
const moveCardToDifferentColumn = async(reqBody) => {
  try {
    // eslint-disable-next-line no-useless-catch

    //  * khi di chuyển card sang column khác
    //  * B1: cập nhật mảng cardOrderIds của column ban đầu chứa nó ( xóa _id của card hiện tại ra khỏi column chứa nó )
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })
    //  * B2: cập nhật lại mảng cardOrderIds của column được chuyển đén ( thêm _id card đang di chuyển vào mảng card được kéo đến)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    //  * B3: cập nhật lại trường columnId mới của cái card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    } )
    return { updateResult: 'Successfully!' }
  } catch (error) { throw new Error(error) }
}
export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}