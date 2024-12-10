import { Schema, model, Document, Types } from 'mongoose'

export interface IReview extends Document {
  _id: Types.ObjectId
  product: Types.ObjectId
  user: Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

export const ReviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must not be more than 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      maxlength: [500, 'Comment must not be more than 500 characters'],
    },
  },
  { timestamps: true }
)

export const Review = model<IReview>('Review', ReviewSchema)
