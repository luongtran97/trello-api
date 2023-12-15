import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
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

export const boardService = {
  createNew
}