import { Schema, model, Document, Types } from 'mongoose'

export interface IVariant extends Document {
  _id: Types.ObjectId
  productId: Types.ObjectId // Liên kết đến sản phẩm
  combination: string // Ví dụ: "Đen - L" (kết hợp màu và kích cỡ)
  options: Types.ObjectId[] // Liên kết đến các thuộc tính của biến thể này
  stock: number // Số lượng tồn kho cho biến thể này
  price: number // Giá cho biến thể này
  images: string[] // Hình ảnh của biến thể này
  isAvailable: boolean // Biến thể này có còn hàng không
}

const VariantSchema = new Schema<IVariant>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  combination: {
    type: String,
    required: true, // Ví dụ: "Đen - L"
  },
  options: [{ type: Schema.Types.ObjectId, ref: 'TierOption' }],
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  images: { type: [String], default: [] },
  isAvailable: { type: Boolean, default: true },
})

export const Variant = model<IVariant>('Variant', VariantSchema)
