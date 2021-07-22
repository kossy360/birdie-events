import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { AppError } from '../utilities/error';

export const validate = (
  field: 'body' | 'query' | 'params',
  schema: Joi.AnySchema
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req[field] = await schema.validateAsync(req[field], {
        stripUnknown: true,
      });

      next();
    } catch (error) {
      next(new AppError(error.message, 400, 'Validation error'));
    }
  };
};
