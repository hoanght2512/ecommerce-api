import { Request, Response } from 'express'
import Variant from '../models/variant'
import Product from '../models/product'
import { ErrorHandler } from '../utils/utility-class'
import { tryCatch } from '../middlewares/trycatch'

// Lấy tất cả biến thể
export const getVariants = tryCatch(async (req: Request, res: Response) => {
  const { product } = req.query
  const filter = product ? { product } : {}

  const variants = await Variant.find(filter).populate('product', 'title')

  res.status(200).json({
    success: true,
    data: variants,
  })
})

// Tạo mới biến thể
export const createVariant = tryCatch(async (req: Request, res: Response) => {
  const { name, attributes, price, image, product } = req.body

  const productExists = await Product.findById(product)
  if (!productExists) throw new ErrorHandler('Product not found', 404)

  const variant = new Variant({ name, attributes, price, image, product })
  await variant.save()

  res.status(201).json({
    success: true,
    data: variant,
  })
})

// Xóa biến thể
export const deleteVariant = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params

  const variant = await Variant.findByIdAndDelete(id)
  if (!variant) throw new ErrorHandler('Variant not found', 404)

  res.status(200).json({
    success: true,
    message: 'Variant deleted successfully',
  })
})
