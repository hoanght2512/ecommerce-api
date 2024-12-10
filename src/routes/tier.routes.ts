import { Router } from 'express'
import { validate } from '../middlewares/validator'
import { authAdminMiddleware } from '../middlewares/auth'
import { body } from 'express-validator'
import { createTier } from '../controllers/tier.controller'

const tierRouter = Router()

tierRouter.use(authAdminMiddleware)

// create Tier
tierRouter.post(
  '/',
  validate([
    body('name').isString().notEmpty(),
    body('options')
      .isArray({ min: 1 })
      .withMessage('Options must be an array with at least 1 element'),
    body('options.*.value')
      .isString()
      .notEmpty()
      .withMessage('Option value is required'),
  ]),
  createTier
)

export default tierRouter
