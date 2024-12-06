import { Router } from 'express'
import {
  deleteLocation,
  updateLocation,
  createLocation,
  getLocation,
  getLocations,
} from '../controllers/location.controller'
import { authAdminMiddleware } from '../middlewares/auth'

const locationRoutes = Router()

locationRoutes.get('/', authAdminMiddleware, getLocations)

locationRoutes.get('/:id', authAdminMiddleware, getLocation)

locationRoutes.post('/', authAdminMiddleware, createLocation)

locationRoutes.put('/:id', authAdminMiddleware, updateLocation)

locationRoutes.delete('/:id', authAdminMiddleware, deleteLocation)

export default locationRoutes
