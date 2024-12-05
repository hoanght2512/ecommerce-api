import { Schema, Document, model, Types } from 'mongoose'
import { IProduct } from './product'
import { IVariant } from './variant'

export interface IStock extends Document {
  _id: Types.ObjectId
  product: Types.ObjectId | IProduct
  variant?: Types.ObjectId | IVariant
  quantity: number
  location?: string
  createdAt: Date
  updatedAt: Date
}

const stockSchema = new Schema<IStock>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: 'Variant',
    },
    quantity: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
)

const Stock = model<IStock>('Stock', stockSchema)

export default Stock
