import { Router } from 'express'
import { validate } from '../middlewares/validator'
import { body, param, query } from 'express-validator'
import { authMiddleware } from '../middlewares/auth'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController'

const productRoutes = Router()

// List all products
productRoutes.get(
  '/',
  validate([
    query('category').optional().isMongoId().withMessage('Invalid category ID'),
  ]),
  getProducts
)

// Get a specific product
productRoutes.get(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid product ID')]),
  getProductById
)

// Create a new product
productRoutes.post(
  '/',
  authMiddleware,
  validate([
    body('title').isString().withMessage('Title is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('description').isString().withMessage('Description is required'),
    body('image').isString().withMessage('Image URL is required'),
    body('category').isMongoId().withMessage('Invalid category ID'),
  ]),
  createProduct
)

// Update a product
productRoutes.put(
  '/:id',
  authMiddleware,
  validate([
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
    body('image')
      .optional()
      .isString()
      .withMessage('Image URL must be a string'),
    body('category').optional().isMongoId().withMessage('Invalid category ID'),
  ]),
  updateProduct
)

// Delete a product
productRoutes.delete(
  '/:id',
  authMiddleware,
  validate([param('id').isMongoId().withMessage('Invalid product ID')]),
  deleteProduct
)

export default productRoutes
