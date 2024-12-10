import { Schema, model, Document, Types } from 'mongoose'

export interface ITierOption extends Document {
  _id: Types.ObjectId
  value: string
  isAvailable: boolean
}

const TierOptionSchema = new Schema<ITierOption>({
  value: {
    type: String,
    required: [true, 'Value is required'],
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
})

export const TierOption = model<ITierOption>('TierOption', TierOptionSchema)
