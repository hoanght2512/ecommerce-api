import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import mongoConnect from './config/database'
import authRoutes from './routes/authRoutes'
import categoryRoutes from './routes/categoryRoutes'
import productRoutes from './routes/productRoutes'
import variantRoutes from './routes/variantRoutes'
import stockRoutes from './routes/stockRoutes'
import uploadRoutes from './routes/uploadRoutes'
import { errorMiddleware } from './middlewares/error'

dotenv.config()
const app = express()
const port = process.env.PORT

app.use('/public', express.static(path.join(__dirname, '../public/uploads')))

// setup crsf protection

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
}

mongoConnect()

app.use(cors(corsOptions))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/variants', variantRoutes)
app.use('/api/v1/stocks', stockRoutes)
app.use('/api/v1/uploads', uploadRoutes)

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
