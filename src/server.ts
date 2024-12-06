import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import mongoConnect from './config/database'
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import uploadRoutes from './routes/upload.routes'
import locationRoutes from './routes/location.routes'
import { errorMiddleware } from './middlewares/error'
import categoryRoutes from './routes/category.routes'

dotenv.config()
const app = express()
const port = process.env.PORT

app.use('/public', express.static(path.join(__dirname, '../public/uploads')))

app.use(helmet())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
}

mongoConnect()

app.use(cors(corsOptions))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/locations', locationRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/uploads', uploadRoutes)

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
