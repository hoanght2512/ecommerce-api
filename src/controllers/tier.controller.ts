import { Request, Response } from 'express'
import { tryCatch } from '../middlewares/trycatch'
import { Tier } from '../models/tier.model'
import { TierOption } from '../models/tieroption.model'

export const createTier = tryCatch(async (req: Request, res: Response) => {
  const session = await Tier.startSession()
  session.startTransaction()
  try {
    const { name, options } = req.body

    const savedOptions = await TierOption.insertMany(options)

    // 2. Tạo TierVariation, tham chiếu đến các TierVariationOption vừa tạo
    const tierVariation = new Tier({
      name,
      options: savedOptions.map((option) => option._id), // Lấy ObjectId của các options đã tạo
    })

    await tierVariation.save()

    await session.commitTransaction()
    session.endSession()

    // Trả về thông tin vừa tạo
    res.status(201).json({
      success: true,
      message: 'Create tier successfully',
      data: tierVariation,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    console.error(error)
    throw new Error('Failed to create tier')
  }
})
