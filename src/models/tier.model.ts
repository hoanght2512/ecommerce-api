import { Schema, model, Document, Types } from 'mongoose'

export interface ITier extends Document {
  _id: Types.ObjectId
  name: string // Ví dụ: "Màu", "Size"
  options: Types.ObjectId[] // Liên kết đến các biến thể bằng id
}

const TierSchema = new Schema<ITier>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  options: {
    type: [{ type: Schema.Types.ObjectId, ref: 'TierOption' }],
    unique: true,
  },
})

export const Tier = model<ITier>('Tier', TierSchema)
