import crypto from 'crypto';
import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Conta } from '@prisma/client';
import { AppError } from '@src/errors/AppError';

import { ErrorMessages } from './ErrorMessages';

const cookieExpirationTimeInHours = 1;
const cookieExpirationTimeInMilliseconds = cookieExpirationTimeInHours * 60 * 60 * 1000;

const gerarResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + cookieExpirationTimeInHours);
  return { token, expiresAt };
};

const gerarHashSenha = async (senha: string) => {
  const salt = await genSalt(10);
  return await bcrypt.hash(senha, salt);
};

const criaAccessToken = (conta: Conta) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError(ErrorMessages.serverError, 500);
  }

  const token = jwt.sign({ id: conta.id, email: conta.email }, process.env.JWT_SECRET, {
    expiresIn: cookieExpirationTimeInHours,
  });

  return `Bearer ${token}`;
};

export {
  gerarResetToken,
  gerarHashSenha,
  cookieExpirationTimeInHours,
  cookieExpirationTimeInMilliseconds,
  criaAccessToken,
};
