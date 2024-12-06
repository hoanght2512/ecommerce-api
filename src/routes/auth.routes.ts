import { Router } from 'express'
import {
  login,
  refresh,
  register,
  forgotPassword,
  changePassword,
  getProfile,
  updateProfile,
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
} from '../controllers/auth.controller'
import { validate } from '../middlewares/validator'
import { body, param } from 'express-validator'
import { authMiddleware } from '../middlewares/auth'

const authRoutes = Router()

authRoutes.post(
  '/login',
  validate([
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email address'),
    body('password')
      .isString()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be at least 6-20 characters long')
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
      .withMessage('Invalid credentials'),
  ]),
  login
)

authRoutes.put(
  '/refresh',
  validate([
    body('refresh_token').notEmpty().withMessage('Refresh token is required'),
  ]),
  refresh
)

authRoutes.post(
  '/register',
  validate([
    body('first_name')
      .isString()
      .notEmpty()
      .withMessage('First name is required'),
    body('last_name')
      .isString()
      .notEmpty()
      .withMessage('Last name is required'),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email address'),
    body('password')
      .isString()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be at least 6-20 characters long')
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
  ]),
  register
)

authRoutes.post(
  '/forgot-password',
  validate([
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email address'),
  ]),
  forgotPassword
)

authRoutes.put(
  '/change-password',
  validate([
    body('current_password')
      .isString()
      .notEmpty()
      .withMessage('Current password is required')
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be at least 6-20 characters long')
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
      .withMessage('Invalid credentials'),
    body('new_password')
      .isString()
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be at least 6-20 characters long')
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
  ]),
  authMiddleware,
  changePassword
)

authRoutes.get('/profile', authMiddleware, getProfile)

authRoutes.put(
  '/profile',
  validate([
    body('first_name')
      .isString()
      .notEmpty()
      .withMessage('First name is required'),
    body('last_name')
      .isString()
      .notEmpty()
      .withMessage('Last name is required'),
    body('phone')
      .isString()
      .optional()
      .isMobilePhone('en-US')
      .withMessage('Invalid phone number'),
  ]),
  authMiddleware,
  updateProfile
)

authRoutes.get('/address', authMiddleware, getAddress)

authRoutes.put(
  '/address/set-primary/:id',
  validate([param('id').isMongoId().withMessage('Invalid address ID')]),
  authMiddleware,
  setPrimaryAddress
)

authRoutes.post(
  '/address',
  validate([
    body('first_name')
      .isString()
      .notEmpty()
      .withMessage('First name is required'),
    body('last_name')
      .isString()
      .notEmpty()
      .withMessage('Last name is required'),
    body('phone')
      .isString()
      .notEmpty()
      .withMessage('Phone is required')
      .isMobilePhone('en-US')
      .withMessage('Invalid phone number'),
    body('address1').isString().notEmpty().withMessage('Address is required'),
    body('address2').isString().optional(),
    body('company').isString().optional(),
    body('country').isString().notEmpty().withMessage('Country is required'),
    body('country_code')
      .isString()
      .notEmpty()
      .withMessage('Country code is required'),
    body('district').isString().notEmpty().withMessage('District is required'),
    body('district_code')
      .isString()
      .notEmpty()
      .withMessage('District code is required'),
    body('province').isString().notEmpty().withMessage('Province is required'),
    body('province_code')
      .isString()
      .notEmpty()
      .withMessage('Province code is required'),
    body('ward').isString().notEmpty().withMessage('Ward is required'),
    body('ward_code')
      .isString()
      .notEmpty()
      .withMessage('Ward code is required'),
  ]),
  authMiddleware,
  addAddress
)

authRoutes.put(
  '/address/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid address ID'),
    body('first_name')
      .isString()
      .notEmpty()
      .withMessage('First name is required'),
    body('last_name')
      .isString()
      .notEmpty()
      .withMessage('Last name is required'),
    body('phone')
      .isString()
      .notEmpty()
      .withMessage('Phone is required')
      .isMobilePhone('en-US')
      .withMessage('Invalid phone number'),
    body('address1').isString().notEmpty().withMessage('Address is required'),
    body('address2').isString().optional(),
    body('company').isString().optional(),
    body('country').isString().notEmpty().withMessage('Country is required'),
    body('country_code')
      .isString()
      .notEmpty()
      .withMessage('Country code is required'),
    body('district').isString().notEmpty().withMessage('District is required'),
    body('district_code')
      .isString()
      .notEmpty()
      .withMessage('District code is required'),
    body('province').isString().notEmpty().withMessage('Province is required'),
    body('province_code')
      .isString()
      .notEmpty()
      .withMessage('Province code is required'),
    body('ward').isString().notEmpty().withMessage('Ward is required'),
    body('ward_code')
      .isString()
      .notEmpty()
      .withMessage('Ward code is required'),
  ]),
  authMiddleware,
  updateAddress
)

authRoutes.delete(
  '/address/:id',
  validate([param('id').isMongoId().withMessage('Invalid address ID')]),
  authMiddleware,
  deleteAddress
)

export default authRoutes
