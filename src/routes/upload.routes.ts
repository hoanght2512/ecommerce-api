import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth'
import upload from '../config/upload'
import {
  uploadImage,
  replaceProductImage,
} from '../controllers/upload.controller'

const uploadRoutes = Router()

// Đang làm
uploadRoutes.post('/image', authMiddleware, upload.single('image'), uploadImage)

uploadRoutes.post(
  '/image/:productId',
  authMiddleware,
  upload.single('image'),
  replaceProductImage
)

export default uploadRoutes
