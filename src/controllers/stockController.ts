import { Request, Response } from 'express'
import Stock from '../models/stock'
import Product from '../models/product'
import Variant from '../models/variant'
import { ErrorHandler } from '../utils/utility-class'
import { tryCatch } from '../middlewares/trycatch'

// Lấy danh sách tồn kho
export const getStocks = tryCatch(async (req: Request, res: Response) => {
  const { product, variant } = req.query
  const filter: any = {}
  if (product) filter.product = product
  if (variant) filter.variant = variant

  const stocks = await Stock.find(filter)
    .populate('product', 'title')
    .populate('variant', 'name')

  res.status(200).json({
    success: true,
    data: stocks,
  })
})

// Tạo mới tồn kho
export const createStock = tryCatch(async (req: Request, res: Response) => {
  const { product, variant, quantity, location } = req.body

  const productExists = await Product.findById(product)
  if (!productExists) throw new ErrorHandler('Product not found', 404)

  if (variant) {
    const variantExists = await Variant.findById(variant)
    if (!variantExists) throw new ErrorHandler('Variant not found', 404)
  }

  const stock = new Stock({ product, variant, quantity, location })
  await stock.save()

  res.status(201).json({
    success: true,
    data: stock,
  })
})
