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

// list all categories
categoryRoutes.get(
  '/',
  validate([
    param('page').optional().isNumeric().toInt(),
    param('limit').optional().isNumeric().toInt(),
  ]),
  getCategories
)

// get a specific category
categoryRoutes.get(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid category ID')]),
  getCategoryById
)

// create a new category
categoryRoutes.post(
  '/',
  authAdminMiddleware,
  validate([
    body('name').isString().withMessage('Name is required'),
    body('description').isString().withMessage('Description is required'),
    body('image').isString().withMessage('Image is required'),
    body('parent').optional().isMongoId().withMessage('Invalid parent ID'),
  ]),
  createCategory
)

// update a category
categoryRoutes.put(
  '/:id',
  authAdminMiddleware,
  validate([
    param('id').isMongoId().withMessage('Invalid category ID'),
    body('name').isString().withMessage('Name is required'),
    body('description').isString().withMessage('Description is required'),
    body('image').isString().withMessage('Image is required'),
    body('parent').optional().isMongoId().withMessage('Invalid parent ID'),
  ]),
  updateCategory
)

// delete a category
categoryRoutes.delete(
  '/:id',
  authAdminMiddleware,
  validate([param('id').isMongoId().withMessage('Invalid category ID')]),
  deleteCategory
)

export default categoryRoutes
