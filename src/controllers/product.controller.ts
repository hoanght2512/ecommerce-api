import { Request, Response } from 'express'
import Product from '../models/product.model'
import Variant from '../models/variant.model'
import Stock from '../models/stock.model'
import { Types } from 'mongoose'
import { tryCatch } from '../middlewares/trycatch'

export const createProduct = tryCatch(async (req: Request, res: Response) => {
  const { title, price, image, description, category, variants } = req.body

  // 1. Tạo sản phẩm
  const newProduct = new Product({
    title,
    price,
    image,
    description,
    category,
  })

  await newProduct.save()

  // 2. Xử lý biến thể và tồn kho
  const variantIds: Types.ObjectId[] = []
  for (const variant of variants) {
    const { name, attributes, price, image, quantity, location } = variant

    // 2.1 Tạo biến thể
    const newVariant = new Variant({
      name,
      attributes,
      price,
      image,
      product: newProduct._id,
    })

    await newVariant.save()
    variantIds.push(newVariant._id)

    // 2.2 Tạo tồn kho cho biến thể
    const newStock = new Stock({
      product: newProduct._id,
      variant: newVariant._id,
      quantity: quantity,
      location: location,
    })

    await newStock.save()
  }

  // 3. Cập nhật danh sách variants cho sản phẩm
  newProduct.variants = variantIds
  await newProduct.save()

  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct,
  })
})
