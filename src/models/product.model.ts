import { Schema, Document, model, Types } from 'mongoose'

export interface IProduct extends Document {
  _id: Types.ObjectId
  title: string
  thumbnail: string
  brand: Types.ObjectId | null
  category: Types.ObjectId | null
  description: string
  images: string[]
  attributes: {
    name: string
    value: string
  }
  like: number // Số lượt thích sản phẩm
  stock: number // Tổng số lượng sản phẩm bao gồm cả số lượng của các biến thể
  sold: number // Số lượng sản phẩm đã bán
  isAvailable: boolean
  totalRating: number
  totalReviews: number
  reviews: Types.ObjectId[]
  tier_variations: Types.ObjectId[]
  product_variants: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export const ProductSchema = new Schema<IProduct>(
  {
    // Thông tin cơ bản về sản phẩm
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description must not be more than 500 characters'],
    },
    images: {
      type: [String],
      default: [],
    },
    like: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },

    // Thông tin liên kết
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      default: null,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    tier_variations: [{ type: Schema.Types.ObjectId, ref: 'Tier' }],
    product_variants: [{ type: Schema.Types.ObjectId, ref: 'Variant' }],

    // Thông tin về đánh giá
    totalRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],

    // Thông tin bổ sung
    attributes: [
      {
        name: {
          type: String,
          required: [true, 'Attribute name is required'],
        },
        value: {
          type: String,
          required: [true, 'Attribute value is required'],
        },
      },
    ],
  },
  { timestamps: true }
)

export const Product = model<IProduct>('Product', ProductSchema)
