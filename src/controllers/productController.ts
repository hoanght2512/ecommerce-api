import { Request, Response } from 'express'
import Product from '../models/product'
import Category from '../models/category'
import { ErrorHandler } from '../utils/utility-class'
import { tryCatch } from '../middlewares/trycatch'

// Lấy danh sách sản phẩm
export const getProducts = tryCatch(async (req: Request, res: Response) => {
  const { category } = req.query

  const filter = category ? { category } : {}
  const products = await Product.find(filter).populate(
    'category',
    'name description image'
  )

  res.status(200).json({
    success: true,
    data: products,
  })
})

// Lấy chi tiết một sản phẩm
export const getProductById = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params

  const product = await Product.findById(id)
    .populate('category', 'name description image')
    .populate('variants')

  if (!product) throw new ErrorHandler('Product not found', 404)

  res.status(200).json({
    success: true,
    data: product,
  })
})

// Tạo mới sản phẩm
export const createProduct = tryCatch(async (req: Request, res: Response) => {
  const { title, price, image, description, category } = req.body

  const categoryExists = await Category.findById(category)
  if (!categoryExists) throw new ErrorHandler('Category not found', 404)

  const product = new Product({ title, price, image, description, category })
  await product.save()

  res.status(201).json({
    success: true,
    data: product,
  })
})

// Cập nhật sản phẩm
export const updateProduct = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params
  const { title, price, image, description, category } = req.body

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { title, price, image, description, category },
    { new: true, runValidators: true }
  )

  if (!updatedProduct) throw new ErrorHandler('Product not found', 404)

  res.status(200).json({
    success: true,
    data: updatedProduct,
  })
})

// Xóa sản phẩm
export const deleteProduct = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params

  const product = await Product.findByIdAndDelete(id)
  if (!product) throw new ErrorHandler('Product not found', 404)

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  })
})
