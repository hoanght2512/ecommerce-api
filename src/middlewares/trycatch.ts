import { NextFunction, Request, Response } from 'express'
import { ControllerType } from '../types/types'

export const tryCatch = (fn: ControllerType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
