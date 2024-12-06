import { Request, Response } from 'express'
import { tryCatch } from '../middlewares/trycatch'
import Location from '../models/location.model'
import { NotFoundError } from '../utils/utility-class'

export const getLocations = tryCatch(async (req: Request, res: Response) => {
  const { page, limit } = req.query

  const locations = await Location.find()
    .limit(Number(limit))
    .skip(Number(page) * Number(limit))

  if (!locations) res.status(204).json({ message: 'No locations found' })

  res.json({
    success: true,
    message: 'Get locations',
    data: locations,
  })
})

export const getLocation = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params

  const location = await Location.findById(id)

  if (!location) throw new NotFoundError('Location not found')

  res.json({
    success: true,
    message: 'Get location',
    data: location,
  })
})

export const createLocation = tryCatch(async (req: Request, res: Response) => {
  const { name, address } = req.body

  const location = new Location({
    name,
    address,
  })

  await location.save()

  res.json({
    success: true,
    message: 'Create location',
    data: location,
  })
})

export const updateLocation = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, address } = req.body

  const location = await Location.findByIdAndUpdate(
    id,
    { name, address },
    { new: true }
  )

  if (!location) throw new NotFoundError('Location not found')

  res.json({
    success: true,
    message: 'Update location',
    data: location,
  })
})

export const deleteLocation = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params

  const location = await Location.findByIdAndDelete(id)

  if (!location) throw new NotFoundError('Location not found')

  res.json({
    success: true,
    message: 'Delete success',
  })
})
