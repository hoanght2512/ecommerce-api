import { Router } from 'express'
import { validate } from '../middlewares/validator'
import { body, query } from 'express-validator'
import { authMiddleware } from '../middlewares/auth'
import { getStocks, createStock } from '../controllers/stockController'

const stockRoutes = Router()

// List all stocks
stockRoutes.get(
  '/',
  validate([
    query('product').optional().isMongoId().withMessage('Invalid product ID'),
    query('variant').optional().isMongoId().withMessage('Invalid variant ID'),
  ]),
  getStocks
)

// Create a new stock entry
stockRoutes.post(
  '/',
  authMiddleware,
  validate([
    body('product').isMongoId().withMessage('Invalid product ID'),
    body('variant').optional().isMongoId().withMessage('Invalid variant ID'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('location').isString().withMessage('Location is required'),
  ]),
  createStock
)

export default stockRoutes
