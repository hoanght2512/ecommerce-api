import { Router } from 'express'
import { validate } from '../middlewares/validator'
import { authAdminMiddleware } from '../middlewares/auth'
import { body, param, query } from 'express-validator'
import {
  createProduct,
  // deleteProduct,
  // getProduct,
  // getProducts,
  // updateProduct,
} from '../controllers/product.controller'

const productRouter = Router()

productRouter.use(authAdminMiddleware)

productRouter.post(
  '/',
  validate([
    body('title').isString().withMessage('Title is required').trim(),
    body('thumbnail')
      .isString()
      .withMessage('Thumbnail is required')
      .isURL()
      .withMessage('Thumbnail must be a valid URL'),
    body('description')
      .isString()
      .withMessage('Description is required')
      .trim(),
    body('images')
      .isArray()
      .withMessage('Images must be an array')
      .optional({ nullable: true }),
    body('images.*')
      .isString()
      .withMessage('Each image must be a valid URL')
      .isURL()
      .withMessage('Each image must be a valid URL'),
    body('brand')
      .optional({ nullable: true })
      .isMongoId()
      .withMessage('Brand must be a valid ObjectId'),
    body('category')
      .isMongoId()
      .withMessage('Category is required and must be a valid ObjectId'),
    body('tier_variations')
      .isArray({ min: 1 })
      .withMessage('Tier variations must be an array with at least one tier'),
    body('tier_variations.*')
      .isMongoId()
      .withMessage('Each tier variation must be a valid ObjectId'),
    body('product_variants')
      .isArray({ min: 1 })
      .withMessage(
        'Product variants must be an array with at least one variant'
      ),
    body('product_variants.*.options')
      .isArray({ min: 1 })
      .withMessage('Option IDs must be an array with at least one ID'),
    body('product_variants.*.options.*')
      .isMongoId()
      .withMessage('Each option ID must be a valid ObjectId'),
    body('product_variants.*.stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be an integer greater than or equal to 0'),
    body('product_variants.*.price')
      .isNumeric()
      .withMessage('Price must be a valid number'),
    body('product_variants.*.images')
      .isArray()
      .withMessage('Images must be an array')
      .optional({ nullable: true }),
    body('product_variants.*.images.*')
      .isString()
      .withMessage('Each image must be a valid URL')
      .isURL()
      .withMessage('Each image must be a valid URL'),
    body('attributes')
      .isArray()
      .withMessage('Attributes must be an array')
      .optional({ nullable: true }),
    body('attributes.*.name')
      .isString()
      .withMessage('Attribute name is required'),
    body('attributes.*.value')
      .isString()
      .withMessage('Attribute value is required'),
  ]),
  createProduct
)

export default productRouter
