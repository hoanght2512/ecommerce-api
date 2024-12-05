import { Router } from 'express'
import { validate } from '../middlewares/validator'
import { body, param } from 'express-validator'
import { authMiddleware } from '../middlewares/auth'
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController'

const categoryRoutes = Router()

// list all categories
categoryRoutes.get('/', getCategories)

// get a specific category
categoryRoutes.get(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid category ID')]),
  getCategoryById
)

// create a new category
categoryRoutes.post(
  '/',
  authMiddleware,
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
  authMiddleware,
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
  authMiddleware,
  validate([param('id').isMongoId().withMessage('Invalid category ID')]),
  deleteCategory
)

export default categoryRoutes
