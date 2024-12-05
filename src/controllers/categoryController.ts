import { Request, Response } from 'express'
import Category from '../models/category'
import { ErrorHandler } from '../utils/utility-class'
import { Types } from 'mongoose'
import { tryCatch } from '../middlewares/trycatch'

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
  if (!category) throw new ErrorHandler('Category not found', 404)

  res.status(200).json({
    success: true,
    data: category,
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
    if (!checkParent) throw new ErrorHandler('Parent category not found', 404)
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { name, description, image, parent },
    { new: true, runValidators: true }
  )

  if (!updatedCategory) throw new ErrorHandler('Category not found', 404)

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

// Xóa danh mục
export const deleteCategory = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params

  const category = await Category.findByIdAndDelete(id)
  if (!category) throw new ErrorHandler('Category not found', 404)

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  })
})
