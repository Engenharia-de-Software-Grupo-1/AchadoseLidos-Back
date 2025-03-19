import { TipoConta } from '@prisma/client';
import { AppError } from '@src/errors/AppError';
import { ErrorMessages } from '@src/errors/ErrorMessages';
import { InternalServerError } from '@src/errors/InternalServerError';
import { TokenInvalidError } from '@src/errors/TokenInvalidError';
import { NextFunction, Request, Response } from 'express';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;

  if (token) {
    try {
      validaJWT(token, next, res);
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

const ensureIsSebo = (req: Request, res: Response, next: NextFunction) => {
  ensureRole(req, res, next, TipoConta.SEBO);
};

const ensureIsUsuario = (req: Request, res: Response, next: NextFunction) => {
  ensureRole(req, res, next, TipoConta.USUARIO);
};

const ensureRole = (req: Request, res: Response, next: NextFunction, role: TipoConta) => {
  const token = req.cookies.authToken;

  if (token) {
    try {
      const tokenInfo = getDecryptedToken(token);
      const userRole = getUserRole(tokenInfo);

      if (userRole === role) {
        res.locals.decryptedToken = tokenInfo;
        next();
      } else {
        throw new AppError(ErrorMessages.unauthorized, 401);
      }
    } catch (e) {
      const isAppError = e instanceof AppError;

      if (isAppError) {
        res.status(e.statusCode).json({ message: e.message });
      } else {
        res.status(500).json({ message: ErrorMessages.serverError });
      }
    }
  } else {
    res.status(401).json({ message: ErrorMessages.tokenNotProvided });
  }
};

const getUserRole = (tokenInfo: string | jwt.Jwt | jwt.JwtPayload | undefined) => {
  let userRole: string = '';

  if (typeof tokenInfo === 'object' && tokenInfo !== null && 'role' in tokenInfo) {
    userRole = tokenInfo.role;
  } else {
    throw new TokenInvalidError();
  }

  return userRole;
};

const getDecryptedToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new InternalServerError();
  }
  const tokenWithoutBearer = token.split(' ')[1];

  let decryptedToken: string | jwt.Jwt | jwt.JwtPayload | undefined;

  jwt.verify(
    tokenWithoutBearer,
    process.env.JWT_SECRET,
    (err: jwt.VerifyErrors | null, decodedToken: Jwt | JwtPayload | string | undefined) => {
      if (err) {
        throw new TokenInvalidError();
      }

      decryptedToken = decodedToken;
    },
  );

  return decryptedToken;
};

const validaJWT = (token: string, next: NextFunction, res: Response) => {
  if (!process.env.JWT_SECRET) {
    throw new InternalServerError();
  }

  const tokenWithoutBearer = token.split(' ')[1];

  jwt.verify(
    tokenWithoutBearer,
    process.env.JWT_SECRET,
    (err: jwt.VerifyErrors | null, decryptedToken: Jwt | JwtPayload | string | undefined) => {
      if (err) {
        throw new TokenInvalidError();
      } else {
        res.locals.decryptedToken = decryptedToken;
        next();
      }
    },
  );
};

export { requireAuth, ensureIsSebo, ensureIsUsuario };
