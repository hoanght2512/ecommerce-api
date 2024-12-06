import { Request, Response } from 'express'
import { ErrorHandler, NotFoundError } from '../utils/utility-class'
import { tryCatch } from '../middlewares/trycatch'
import { Types } from 'mongoose'
import Category from '../models/category.model'
import Product from '../models/product.model'

// Lấy tất cả danh mục hoặc danh mục cha
export const getCategories = tryCatch(async (req: Request, res: Response) => {
  // Sử dụng aggregate pipeline để lấy danh mục và các danh mục con
  const categories = await Category.aggregate([
    // parent: null để lấy danh mục cha
    { $match: { parent: null } },
    {
      $lookup: {
        from: 'categories', // Tên collection của MongoDB (nên đúng với schema)
        localField: '_id',
        foreignField: 'parent',
        as: 'children', // Kết quả truy vấn con sẽ gắn vào trường "children"
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
        children: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
        },
      },
    },
  ])

  if (categories.length === 0) res.status(204)

  res.status(200).json({
    success: true,
    data: categories,
  })
})

// Lấy một danh mục cụ thể
export const getCategoryById = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params

  const category = await Category.aggregate([
    {
      $match: { _id: new Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: 'parent',
        as: 'children',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
        children: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
        },
      },
    },
  ])

  if (category.length === 0) throw new NotFoundError('Category not found')

  res.status(200).json({
    success: true,
    data: category[0],
  })
})

// Tạo một danh mục mới
export const createCategory = tryCatch(async (req: Request, res: Response) => {
  const { name, description, image, parent } = req.body

  const category = new Category({ name, description, image, parent })
  await category.save()

  res.status(201).json({
    success: true,
    data: {
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image,
      parent: category.parent,
    },
  })
})

// Cập nhật danh mục
export const updateCategory = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, description, image, parent } = req.body

  if (parent) {
    const checkParent = await Category.findById(parent)
    if (!checkParent) throw new NotFoundError('Parent category not found')
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { name, description, image, parent },
    { new: true, runValidators: true }
  )

  if (!updatedCategory) throw new NotFoundError('Category not found')

  res.status(200).json({
    success: true,
    data: {
      _id: updatedCategory._id,
      name: updatedCategory.name,
      description: updatedCategory.description,
      image: updatedCategory.image,
      parent: updatedCategory.parent,
    },
  })
})

export const deleteCategory = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params

  // Bắt đầu một session cho transaction
  const session = await Category.startSession()
  session.startTransaction()

  try {
    // Tìm kiếm danh mục
    const category = await Category.findById(id).session(session)

    if (!category) throw new NotFoundError('Category not found')

    // Kiểm tra xem danh mục có danh mục con không
    const children = await Category.find({ parent: category._id }).session(
      session
    )
    if (children.length > 0)
      throw new ErrorHandler('Cannot delete category with children', 400)

    // Kiểm tra xem danh mục có sản phẩm không
    const products = await Product.find({ category: category._id }).session(
      session
    )
    if (products.length > 0)
      throw new ErrorHandler('Cannot delete category with products', 400)

    // Xóa danh mục
    await Category.findByIdAndDelete(id).session(session)

    // Commit transaction nếu tất cả mọi thứ thành công
    await session.commitTransaction()

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    // Nếu có lỗi, rollback transaction
    await session.abortTransaction()
    throw new ErrorHandler('Failed to delete category', 500)
  } finally {
    session.endSession()
  }
})
