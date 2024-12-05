import { Request, Response } from 'express'
import { AuthenticationError, ErrorHandler } from '../utils/utility-class'
import User, { IAddress, IUser } from '../models/user'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { tryCatch } from '../middlewares/trycatch'

// Hàm Tạo access token và refresh token
const generateToken = (user: IUser) => {
  const access_token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1d',
    }
  )

  const refresh_token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '7d',
    }
  )

  return { access_token, refresh_token }
}

// Hàm Ẩn email và số điện thoại
const masked = (str: string) => {
  return str.replace(/.(?=.{4})/g, '*')
}

// Đăng nhập
export const login = tryCatch(async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user || !user.validatePassword(password))
    throw new AuthenticationError('Invalid credentials')

  const { access_token, refresh_token } = generateToken(user)

  res.status(200).json({
    success: true,
    data: {
      first_name: user.firstName,
      last_name: user.lastName,
      roles: user.roles,
      access_token,
      refresh_token,
    },
  })
})

// Lấy access token và refresh token mới
export const refresh = tryCatch(async (req: Request, res: Response) => {
  const { refresh_token } = req.body

  const decoded = jwt.verify(
    refresh_token,
    process.env.JWT_SECRET as string
  ) as JwtPayload
  const user = await User.findById(decoded._id)

  if (!user) throw new AuthenticationError('Unauthorized')

  const { access_token, refresh_token: new_refresh_token } = generateToken(user)

  res.status(200).json({
    success: true,
    data: {
      access_token,
      refresh_token: new_refresh_token,
    },
  })
})

// Đăng ký
export const register = tryCatch(async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body

  const existingUser = await User.findOne({ email })

  if (existingUser) throw new ErrorHandler('Email already exists', 400)

  const address = {
    firstName: first_name,
    lastName: last_name,
    default: true,
  }

  const createdUser = await User.create({
    firstName: first_name,
    lastName: last_name,
    email,
    password,
    address,
  })

  const { access_token, refresh_token } = generateToken(createdUser)

  res.status(201).json({
    success: true,
    data: {
      first_name: createdUser.firstName,
      last_name: createdUser.lastName,
      roles: createdUser.roles,
      access_token,
      refresh_token,
    },
  })
})

// Quên mật khẩu
export const forgotPassword = tryCatch(async (req: Request, res: Response) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  // if user found, send reset password link to email
  if (user) {
    // send reset password link to email
  }

  res.status(200).json({
    success: true,
    message: 'Reset password link sent to email',
  })
})

// Đặt lại mật khẩu
export const changePassword = tryCatch(async (req: Request, res: Response) => {
  const { current_password, new_password } = req.body
  const user = req.user

  if (!user || !user.validatePassword(current_password))
    throw new AuthenticationError('Invalid credentials')

  user.password = new_password
  await user.save()

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  })
})

// Lấy thông tin người dùng
export const getProfile = tryCatch(async (req: Request, res: Response) => {
  const user = req.user

  if (!user) throw new AuthenticationError('Unauthorized')

  res.status(200).json({
    success: true,
    data: {
      first_name: user.firstName,
      last_name: user.lastName,
      email: masked(user.email || ''),
      phone: masked(user.phone || ''),
    },
  })
})

// Cập nhật thông tin người dùng
export const updateProfile = tryCatch(async (req: Request, res: Response) => {
  const { first_name, last_name, phone } = req.body
  const user = req.user

  if (!user) throw new AuthenticationError('Unauthorized')

  user.firstName = first_name
  user.lastName = last_name
  user.phone = phone

  await user.save()

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      first_name: user.firstName,
      last_name: user.lastName,
      email: masked(user.email || ''),
      phone: masked(user.phone || ''),
    },
  })
})

// Thêm địa chỉ
export const getAddress = tryCatch(async (req: Request, res: Response) => {
  const user = req.user

  if (!user) throw new AuthenticationError('Unauthorized')

  res.status(200).json({
    success: true,
    data: user.address as IAddress[],
  })
})

// Đặt địa chỉ mặc định
export const setPrimaryAddress = tryCatch(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.user

    if (!user) throw new AuthenticationError('Unauthorized')

    const addressIndex = user.address.findIndex(
      (address) => address._id.toString() === id
    )

    if (addressIndex === -1) throw new ErrorHandler('Address not found', 404)

    user.address.forEach((address) => {
      address.default = false
    })

    user.address[addressIndex].default = true

    await user.save()

    res.status(200).json({
      success: true,
      data: user.address as IAddress[],
    })
  }
)

// Thêm địa chỉ
export const addAddress = tryCatch(async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    phone,
    address1,
    address2,
    company,
    country,
    country_code,
    district,
    district_code,
    province,
    province_code,
    ward,
    ward_code,
  } = req.body

  const user = req.user

  if (!user) throw new AuthenticationError('Unauthorized')

  user.address.push({
    firstName: first_name,
    lastName: last_name,
    phone,
    address1,
    address2,
    company,
    country,
    countryCode: country_code,
    district,
    districtCode: district_code,
    province,
    provinceCode: province_code,
    ward,
    wardCode: ward_code,
  } as IAddress)

  await user.save()

  res.status(201).json({
    success: true,
    data: user.address as IAddress[],
  })
})

// Cập nhật địa chỉ
export const updateAddress = tryCatch(async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    phone,
    address1,
    address2,
    company,
    country,
    country_code,
    district,
    district_code,
    province,
    province_code,
    ward,
    ward_code,
  } = req.body

  const { id } = req.params
  const user = req.user

  if (!user) throw new AuthenticationError('Unauthorized')

  const addressIndex = user.address.findIndex(
    (address) => address._id.toString() === id
  )

  if (addressIndex === -1) throw new ErrorHandler('Address not found', 404)

  user.address[addressIndex] = {
    firstName: first_name,
    lastName: last_name,
    phone,
    address1,
    address2,
    company,
    country,
    countryCode: country_code,
    district,
    districtCode: district_code,
    province,
    provinceCode: province_code,
    ward,
    wardCode: ward_code,
  } as IAddress

  await user.save()

  res.status(200).json({
    success: true,
    data: user.address as IAddress[],
  })
})

// Xóa địa chỉ
export const deleteAddress = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.user

  if (!user) throw new AuthenticationError('Unauthorized')

  const addressIndex = user.address.findIndex(
    (address) => address._id.toString() === id
  )

  if (addressIndex === -1) throw new ErrorHandler('Address not found', 404)

  if (user.address[addressIndex].default)
    throw new ErrorHandler('Cannot delete primary address', 400)

  user.address.splice(addressIndex, 1)

  await user.save()

  res.status(200).json({
    success: true,
    data: user.address as IAddress[],
  })
})
