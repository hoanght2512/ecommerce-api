import { Schema, Document, model, Types } from 'mongoose'

export interface ILocation extends Document {
  _id: Types.ObjectId
  name: string
  address: string
  createdAt: Date
  updatedAt: Date
}

const locationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

locationSchema.methods.toJSON = function () {
  const location = this.toObject()
  delete location.__v
  return location
}

const Location = model<ILocation>('Location', locationSchema)

export default Location
