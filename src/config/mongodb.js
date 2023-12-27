
// mongodb+srv://luongluong99783:<password>@cluster0.nl4mplx.mongodb.net/?retryWrites=true&w=majority
import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'


// khởi tạo một đối tượng trelloDatabaseInstance ban đầu là null ( bởi vì chưa được connect )
let trelloDatabaseInstance = null

// khởi tạo 1 đối tượng Client Instance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi:{
    version:ServerApiVersion.v1,
    strict:true,
    deprecationErrors:true
  }
})

// kết nối tới database
export const CONNECT_BD = async() => {
  // gọi kết nói tới mongobd atlas với uri đã khai báo trong thân của clientInstace
  await mongoClientInstance.connect()
  // kết nói thành công thì lấy database theo tên và gán ngược lại vào biến trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

//đóng kết nối tới database khi cần
export const CLOSE_DB = async() => {
  // eslint-disable-next-line no-console
  await mongoClientInstance.close()
}

// function GETDB này có nhiệm vụ export ra cái trelloDatabaseInstance sau khi đã connect thành công tới mongobd để chúng ta sử dụng ở nhiều nơi khác nhau trong code
// luu ý phải đảm bảo chỉ luôn gọi GET_BD này sau khi đã kết nối thành công
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('must connect to database first')
  return trelloDatabaseInstance
}

