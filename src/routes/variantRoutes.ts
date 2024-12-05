import { Router } from 'express'
import { validate } from '../middlewares/validator'
import { body, param, query } from 'express-validator'
import { authMiddleware } from '../middlewares/auth'
import {
  getVariants,
  createVariant,
  deleteVariant,
} from '../controllers/variantController'

const variantRoutes = Router()

// List all variants
variantRoutes.get(
  '/',
  validate([
    query('product').optional().isMongoId().withMessage('Invalid product ID'),
  ]),
  getVariants
)

// Create a new variant
variantRoutes.post(
  '/',
  authMiddleware,
  validate([
    body('name').isString().withMessage('Name is required'),
    body('attributes').isArray().withMessage('Attributes must be an array'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('image').isString().withMessage('Image URL is required'),
    body('product').isMongoId().withMessage('Invalid product ID'),
  ]),
  createVariant
)

// Delete a variant
variantRoutes.delete(
  '/:id',
  authMiddleware,
  validate([param('id').isMongoId().withMessage('Invalid variant ID')]),
  deleteVariant
)

export default variantRoutes
