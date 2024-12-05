import { Schema, Document, model, Types } from 'mongoose'
import { IProduct } from './product'

export interface IVariant extends Document {
  _id: Types.ObjectId
  name: string
  attributes: Record<string, string | number>
  price: number
  image: string
  product: Types.ObjectId | IProduct
  createdAt: Date
  updatedAt: Date
}

const variantSchema = new Schema<IVariant>(
  {
    name: { type: String, required: true },
    attributes: { type: Schema.Types.Mixed, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
  },
  { timestamps: true }
)

const Variant = model<IVariant>('Variant', variantSchema)

export default Variant
