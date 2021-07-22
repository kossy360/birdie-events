import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utilities/error';

export const errorMiddleware = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.code).json({
      message: err.message,
      error: err.error,
    });
  } else {
    res.status(500).json({
      message: 'Something happened on our end, we are working on it',
    });
  }
};
