import { AppError } from '@src/errors/AppError';
import { ErrorMessages } from '@src/utils/ErrorMessages';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;

  if (token) {
    if (!process.env.JWT_SECRET) {
      throw new AppError(ErrorMessages.serverError, 500);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err: jwt.VerifyErrors | null, _: unknown) => {
      if (err) {
        res.status(401).json({ message: ErrorMessages.invalidToken });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ message: ErrorMessages.tokenNotProvided });
  }
};

export { requireAuth };
