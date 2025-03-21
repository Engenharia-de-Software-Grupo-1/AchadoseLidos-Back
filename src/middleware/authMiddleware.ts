import { TipoConta } from '@prisma/client';
import { InternalServerError } from '@src/errors/InternalServerError';
import { InvalidTokenError } from '@src/errors/InvalidTokenError';
import { NoPermissionError } from '@src/errors/NoPermissionError';
import { TokenNotProvided } from '@src/errors/TokenNotProvided';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const getAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;
  if (!token) {
    res.status(200).json({ autenticado: false });
    return;
  }

  res.locals.decryptedToken = getDecryptedToken(token);
  next();
};

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;
  if (!token) {
    throw new TokenNotProvided();
  }

  res.locals.decryptedToken = getDecryptedToken(token);
  next();
};

const ensureRole = (role: TipoConta) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.authToken;
    if (!token) {
      throw new TokenNotProvided();
    }

    const tokenInfo = getDecryptedToken(token);
    if (tokenInfo.role !== role) {
      throw new NoPermissionError();
    }

    res.locals.decryptedToken = tokenInfo;
    next();
  };
};

const ensureIsSebo = ensureRole(TipoConta.SEBO);
const ensureIsUsuario = ensureRole(TipoConta.USUARIO);

const getDecryptedToken = (token: string): JwtPayload => {
  if (!process.env.JWT_SECRET) {
    throw new InternalServerError();
  }

  try {
    const tokenWithoutBearer = token.split(' ')[1] || token;
    return jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET) as JwtPayload;
  } catch {
    throw new InvalidTokenError();
  }
};

export { getAuth, requireAuth, ensureIsSebo, ensureIsUsuario };
