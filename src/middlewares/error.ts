import { Request, Response, NextFunction } from 'express'
import { ErrorHandler } from '../utils/utility-class'

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(err)
  }

  const code = err.code || 500
  const message = code === 500 ? 'Internal Server Error' : err.message
  res.status(code).json({
    success: false,
    message,
  })
}
