import { Schema, Document, model, Types } from 'mongoose'
import Product, { IProduct } from './product.model'
import Variant, { IVariant } from './variant.model'
import { NotFoundError } from '../utils/utility-class'
import { ILocation } from './location.model'

export interface IStock extends Document {
  _id: Types.ObjectId
  product: Types.ObjectId | IProduct
  variant?: Types.ObjectId | IVariant
  location?: Types.ObjectId | ILocation
  quantity: number
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
    location: {
      type: Schema.Types.ObjectId,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

stockSchema.pre('save', function (next) {
  const product = Product.findById(this.product)
  if (!product) {
    throw new NotFoundError('Product not found')
  }

  if (this.variant) {
    const variant = Variant.findById(this.variant)
    if (!variant) {
      throw new NotFoundError('Variant not found')
    }
  }
  next()
})

const Stock = model<IStock>('Stock', stockSchema)

export default Stock
