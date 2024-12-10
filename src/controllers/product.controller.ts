import { Request, Response } from 'express'
import { tryCatch } from '../middlewares/trycatch'
import { Product } from '../models/product.model'
import { Types } from 'mongoose'
import { Variant } from '../models/variant.model'
import { TierOption } from '../models/tieroption.model'

export const createProduct = tryCatch(async (req: Request, res: Response) => {
  const session = await Product.startSession()
  session.startTransaction()

  try {
    const {
      title,
      thumbnail,
      description,
      images,
      brand = null,
      category = null,
      tier_variations,
      product_variants,
      attributes,
    } = req.body

    // Tạo sản phẩm mới
    const newProduct = new Product({
      title,
      thumbnail,
      description,
      images,
      brand,
      category,
      tier_variations,
      attributes,
    })

    // Tạo biến thể sản phẩm
    const VariantIds: Types.ObjectId[] = []

    for (const variant of product_variants) {
      // Tìm tất cả các tùy chọn từ TierVariationOption
      const options = await TierOption.find({
        _id: { $in: variant.options },
      }).select('value')

      const combination = options.map((option) => option.value).join(' - ')

      const newVariant = new Variant({
        productId: newProduct._id,
        combination, // Gán giá trị kết hợp (combination) cho biến thể
        options: variant.options,
        stock: variant.stock,
        price: variant.price,
        images: variant.images,
      })

      // Lưu biến thể sản phẩm
      await newVariant.save({ session })

      // Thêm ObjectId của biến thể vào VariantIds
      VariantIds.push(newVariant._id)
    }

    // Lưu biến thể sản phẩm vào sản phẩm
    newProduct.product_variants = VariantIds

    // Lưu sản phẩm vào database
    await newProduct.save({ session })

    await session.commitTransaction()

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    })
  } catch (error) {
    await session.abortTransaction()
    throw new Error('Transaction product failed')
  } finally {
    session.endSession()
  }
})
