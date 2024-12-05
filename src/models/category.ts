import { Schema, Document, model, Types } from 'mongoose'
import { ErrorHandler } from '../utils/utility-class'

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
      throw new ErrorHandler('Parent category does not exist', 404)
  }
  if (this.parent && this.parent.equals(this._id)) {
    throw new Error('Category cannot be a parent of itself')
  }
  next()
})

const Category = model<ICategory>('Category', categorySchema)
export default Category
