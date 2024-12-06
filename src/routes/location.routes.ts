import { Router } from 'express'
import {
  deleteLocation,
  updateLocation,
  createLocation,
  getLocation,
  getLocations,
} from '../controllers/location.controller'
import { authAdminMiddleware } from '../middlewares/auth'
import { validate } from '../middlewares/validator'
import { body, param } from 'express-validator'

const locationRoutes = Router()

locationRoutes.get(
  '/',
  validate([
    param('page').optional().isNumeric().toInt(),
    param('limit').optional().isNumeric().toInt(),
  ]),
  authAdminMiddleware,
  getLocations
)

locationRoutes.get(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid location ID')]),
  authAdminMiddleware,
  getLocation
)

locationRoutes.post(
  '/',
  validate([
    body('name').isString().withMessage('Name is required'),
    body('address').isString().withMessage('Address is required'),
  ]),
  authAdminMiddleware,
  createLocation
)

locationRoutes.put(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid location ID'),
    body('name').isString().withMessage('Name is required'),
    body('address').isString().withMessage('Address is required'),
  ]),
  authAdminMiddleware,
  updateLocation
)

locationRoutes.delete(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid location ID')]),
  authAdminMiddleware,
  deleteLocation
)

export default locationRoutes
