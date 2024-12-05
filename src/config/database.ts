import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log('Connected to database')
  } catch (error) {
    console.log(`Error connecting to database: ${error}`)
  }
}

export default mongoConnect
