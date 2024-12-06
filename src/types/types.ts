import { Request, Response, NextFunction } from 'express'
import { IUser } from '../models/user.model'

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>
