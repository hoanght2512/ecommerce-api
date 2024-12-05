import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'

export const validate = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (validations.length === 0) return next()

    // Chạy tất cả các validation
    await Promise.all(validations.map((validation) => validation.run(req)))

    // Kiểm tra kết quả validation
    const errors = validationResult(req)
    if (errors.isEmpty()) return next()

    // Trả về danh sách lỗi
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        message: err.msg,
      })),
    })
  }
}
