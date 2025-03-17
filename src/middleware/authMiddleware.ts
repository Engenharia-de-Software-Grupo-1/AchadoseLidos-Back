import { TipoConta } from '@prisma/client';
import { AppError } from '@src/errors/AppError';
import { ErrorMessages } from '@src/utils/ErrorMessages';
import { NextFunction, Request, Response } from 'express';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';

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
      const tokenInfo = getTokenInfo(token);
      const userRole = getUserRole(tokenInfo);

      if (userRole === role) {
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
    throw new AppError(ErrorMessages.invalidToken, 401);
  }

  return userRole;
};

const getTokenInfo = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError(ErrorMessages.serverError, 500);
  }
  const tokenWithoutBearer = token.split(' ')[1];

  let tokenInfo: string | jwt.Jwt | jwt.JwtPayload | undefined;

  jwt.verify(
    tokenWithoutBearer,
    process.env.JWT_SECRET,
    (err: jwt.VerifyErrors | null, decodedToken: Jwt | JwtPayload | string | undefined) => {
      if (err) {
        throw new AppError(ErrorMessages.invalidToken, 401); // checar se é preciso adicionar next aqui
      }

      tokenInfo = decodedToken;
    },
  );

  return tokenInfo;
};

const validaJWT = (token: string, next: NextFunction) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError(ErrorMessages.serverError, 500);
  }

  const tokenWithoutBearer = token.split(' ')[1];

  jwt.verify(
    tokenWithoutBearer,
    process.env.JWT_SECRET,
    (err: jwt.VerifyErrors | null, _: Jwt | JwtPayload | string | undefined) => {
      if (err) {
        throw new AppError(ErrorMessages.invalidToken, 401);
      } else {
        next();
      }
    },
  );
};

export { requireAuth, ensureIsSebo, ensureIsUsuario };
