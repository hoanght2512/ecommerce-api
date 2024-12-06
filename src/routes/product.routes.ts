import { Router } from 'express'
import { validate } from '../middlewares/validator'
import { authAdminMiddleware } from '../middlewares/auth'
import { body, query } from 'express-validator'
import { createProduct, getProducts } from '../controllers/product.controller'

const productRouter = Router()

productRouter.get(
  '/',
  validate([
    query('page').optional().isNumeric().withMessage('Page must be a number'),
    query('limit').optional().isNumeric().withMessage('Limit must be a number'),
    query('category').optional().isMongoId().withMessage('Category not found'),
  ]),
  getProducts
)

productRouter.post(
  '/',
  authAdminMiddleware,
  validate([
    body('title').isString().withMessage('Title is required'),
    body('price').isNumeric().withMessage('Price is required'),
    body('category').isMongoId().withMessage('Category is required'),
    body('description').isString().withMessage('Description is required'),
    body('image')
      .isString()
      .withMessage('Image is required')
      .isURL()
      .withMessage('Image must be a URL'),
    body('variants').isArray().withMessage('Variants must be an array'),
    body('variants.*.name').isString().withMessage('Name is required'),
    body('variants.*.price')
      .isNumeric()
      .withMessage('Price is required')
      .isInt({ min: 0 })
      .withMessage('Price must be greater than or equal to 0'),
    body('variants.*.image')
      .isString()
      .withMessage('Image is required')
      .isURL()
      .withMessage('Image must be a URL'),
    body('variants.*.attributes')
      .isObject()
      .withMessage('Attributes is required'),
    body('variants.*.quantity')
      .isNumeric()
      .withMessage('Quantity is required')
      .isInt({ min: 0 })
      .withMessage('Quantity must be greater than or equal to 0'),
    body('variants.*.location').isMongoId().withMessage('Location is required'),
  ]),
  createProduct
)

export default productRouter
