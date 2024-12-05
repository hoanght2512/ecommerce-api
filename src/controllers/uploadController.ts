import { Request, Response } from 'express'
import { tryCatch } from '../middlewares/trycatch'

export const uploadImage = tryCatch(async (req: Request, res: Response) => {
  const file = req.file
  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    })
  }

  res.status(201).json({
    success: true,
    message: 'File uploaded',
    data: {
      image: `/public/${file.filename}`,
    },
  })
})

export const replaceProductImage = tryCatch(
  async (req: Request, res: Response) => {}
)
