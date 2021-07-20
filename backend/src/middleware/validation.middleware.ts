import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const validate = (
  field: 'body' | 'query' | 'params',
  schema: Joi.AnySchema
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req[field] = await schema.validateAsync(req[field]);

      next();
    } catch (error) {
      next(error);
    }
  };
};
