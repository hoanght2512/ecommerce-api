import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/user'
import { AuthenticationError } from '../utils/utility-class'

export const authMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) throw new AuthenticationError('Unauthorized')

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload

    const user = await User.findById(payload._id)

    if (!user) throw new AuthenticationError('Unauthorized')

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
