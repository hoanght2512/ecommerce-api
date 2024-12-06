import { Schema, Document, model, Types } from 'mongoose'
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
  if (this.parent) {
    const parentCategory = await Category.findById(this.parent)
    if (!parentCategory)
      throw new NotFoundError('Parent category does not exist')
  }
  if (this.parent && this.parent.equals(this._id)) {
    throw new ErrorHandler('Category cannot be parent of itself', 400)
  }
  next()
})

const Category = model<ICategory>('Category', categorySchema)
export default Category
