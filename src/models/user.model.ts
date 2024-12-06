import { Schema, Document, model } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IAddress extends Document {
  _id: string
  firstName: string
  lastName: string
  phone?: string
  default: boolean
  address1: string
  address2?: string
  company?: string
  country: string
  countryCode: string
  district: string
  districtCode: string
  province: string
  provinceCode: string
  ward: string
  wardCode: string
}

export interface IUser extends Document {
  _id: string
  firstName: string
  lastName: string
  email: string
  password: string
  gender?: string
  phone?: string
  birthdate?: Date
  roles: [string]
  address: IAddress[]
  createdAt: Date
  updatedAt: Date
  encryptPassword(password: string): string
  validatePassword(password: string): boolean
}

const addressSchema = new Schema<IAddress>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    default: {
      type: Boolean,
      default: false,
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    company: {
      type: String,
    },
    country: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    district: {
      type: String,
    },
    districtCode: {
      type: String,
    },
    province: {
      type: String,
    },
    provinceCode: {
      type: String,
    },
    ward: {
      type: String,
    },
    wardCode: {
      type: String,
    },
  },
  { timestamps: true }
)

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    phone: {
      type: String,
    },
    birthdate: {
      type: Date,
    },
    roles: {
      type: [String],
      enum: ['user', 'admin'],
      default: ['user'],
      required: true,
    },
    address: {
      type: [addressSchema],
      default: [],
      validate: {
        validator: (v: IAddress[]) => {
          return v.filter((address) => address.default).length <= 1
        },
        message: 'Only one default address is allowed',
      },
    },
  },
  { timestamps: true }
)

userSchema.methods.encryptPassword = async (password: string) => {
  return bcrypt.hash(password, 10)
}

userSchema.methods.validatePassword = async function (password: string) {
  return bcrypt.compare(password, this.password)
}

userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await this.encryptPassword(this.password)
  }
  next()
})

const User = model<IUser>('User', userSchema)
export default User
