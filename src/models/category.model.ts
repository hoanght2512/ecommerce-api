import { Schema, Document, model, Types, CallbackError } from 'mongoose'
import { ErrorHandler, NotFoundError } from '../utils/utility-class'

export interface ICategory extends Document {
  _id: Types.ObjectId
  name: string
  description: string
  image: string
  parent: Types.ObjectId | null
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true, default: '' },
    image: { type: String, required: true, default: '' },
    parent: { type: Types.ObjectId, ref: 'Category', default: null },
  },
  { timestamps: true }
)

categorySchema.pre('save', async function (next) {
  try {
    // Kiểm tra xem có parent không và nếu có thì kiểm tra sự tồn tại của parent
    if (this.parent) {
      const parentCategory = await Category.findById(this.parent)
      if (!parentCategory) {
        return next(new NotFoundError('Parent category does not exist'))
      }
    }

    // Kiểm tra xem danh mục có phải là cha của chính nó không
    if (this.parent && this.parent.equals(this._id)) {
      return next(new ErrorHandler('Category cannot be parent of itself', 400))
    }

    next() // Tiến hành lưu nếu không có lỗi
  } catch (error) {
    next(error as CallbackError) // Chuyển lỗi cho Express xử lý
  }
})

categorySchema.methods.toJSON = function () {
  const category = this.toObject()
  delete category.__v
  return category
}

const Category = model<ICategory>('Category', categorySchema)
export default Category
