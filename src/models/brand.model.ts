import { Schema, model, Document, Types } from 'mongoose'

export interface IBrand extends Document {
  _id: Types.ObjectId
  name: string
  logo?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const BrandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: 'No description.',
    },
  },
  { timestamps: true }
)

export const Brand = model<IBrand>('Brand', BrandSchema)
