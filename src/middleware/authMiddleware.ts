import { AppError } from '@src/errors/AppError';
import { ErrorMessages } from '@src/utils/ErrorMessages';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;

  if (token) {
    try {
      validaJWT(token, next);
    } catch (e) {
      const isAppError = e instanceof AppError;

      if (isAppError) {
        res.status(e.statusCode).json({ message: e.message });
      }

      res.status(500).json({ message: ErrorMessages.serverError });
    }
  } else {
    res.status(401).json({ message: ErrorMessages.tokenNotProvided });
  }
};

const validaJWT = (token: string, next: NextFunction) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError(ErrorMessages.serverError, 500);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: jwt.VerifyErrors | null, _: unknown) => {
    if (err) {
      throw new AppError(ErrorMessages.invalidToken, 401);
    } else {
      next();
    }
  });
};

export { requireAuth };
