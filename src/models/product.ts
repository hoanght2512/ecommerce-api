import { Schema, Document, model, Types } from 'mongoose'
import { IVariant } from './variant'
import { ICategory } from './category'

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

const Product = model<IProduct>('Product', productSchema)

export default Product
