import { Schema, Document, model, Types, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { IVariant } from './variant.model'
import { ICategory } from './category.model'

export interface IProduct extends Document {
  _id: Types.ObjectId
  title: string
  price: number
  image: string
  description: string
  category: Types.ObjectId | ICategory
  variants: Types.ObjectId[] | IVariant[]
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    variants: [{ type: Schema.Types.ObjectId, ref: 'Variant' }],
  },
  { timestamps: true }
)

productSchema.plugin(paginate)

productSchema.methods.toJSON = function () {
  const product = this.toObject()
  delete product.__v
  return product
}

const Product = model<IProduct, PaginateModel<IProduct>>(
  'Product',
  productSchema
)

export default Product
