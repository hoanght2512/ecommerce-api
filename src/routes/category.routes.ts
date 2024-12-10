import { Router } from 'express'
import { validate } from '../middlewares/validator'
import { body, param } from 'express-validator'
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller'
import { authAdminMiddleware } from '../middlewares/auth'

const categoryRoutes = Router()

categoryRoutes.use(authAdminMiddleware)

categoryRoutes.get(
  '/',
  validate([
    param('page').optional().isNumeric().toInt(),
    param('limit').optional().isNumeric().toInt(),
  ]),
  getCategories
)

categoryRoutes.get(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid category ID')]),
  getCategoryById
)

categoryRoutes.post(
  '/',
  validate([
    body('name').isString().withMessage('Name is required'),
    body('description').isString().withMessage('Description is required'),
    body('image').isString().withMessage('Image is required'),
    body('parent').optional().isMongoId().withMessage('Invalid parent ID'),
  ]),
  createCategory
)

categoryRoutes.put(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid category ID'),
    body('name').isString().withMessage('Name is required'),
    body('description').isString().withMessage('Description is required'),
    body('image').isString().withMessage('Image is required'),
    body('parent').optional().isMongoId().withMessage('Invalid parent ID'),
  ]),
  updateCategory
)

categoryRoutes.delete(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid category ID')]),
  deleteCategory
)

export default categoryRoutes
