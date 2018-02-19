import { ExpressMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { validate } from 'joi';
import { authSchema } from '../schemas/auth.schema';
import { replace } from '../../../utilities/helpers';

export const bodyValidatorMiddleware: ExpressMiddleware =
  async (req: Request, res: Response, next: Function) => {
    const result = validate(req.body, authSchema);

    if (result.error) {
      const errorMessage = result.error.details.shift().message;
      const message: string = replace(errorMessage, /["]/g, '');

      return next(new BadRequestException(`Validation failed: ${message}`));
    }

    next();
  };