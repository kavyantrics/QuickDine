import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'

export interface CustomError extends Error {
  statusCode?: number
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : (err.statusCode || 500)
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}