import crypto from 'crypto';
import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Conta, Sebo, Usuario } from '@prisma/client';
import { AppError } from '@src/errors/AppError';

import { ErrorMessages } from '../errors/ErrorMessages';

type ContaWithRelations = Conta & {
  sebo?: Sebo | null;
  usuario?: Usuario | null;
};

const cookieExpirationTimeInHours = 1;
const cookieExpirationTimeInSeconds = cookieExpirationTimeInHours * 60 * 60;
const cookieExpirationTimeInMilliseconds = cookieExpirationTimeInSeconds * 1000;

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

const criarAcessToken = (conta: ContaWithRelations) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError(ErrorMessages.serverError, 500);
  }

  let token: string = '';

  if (conta.sebo) {
    token = jwt.sign({ id: conta.sebo.id, email: conta.email, role: conta.tipo }, process.env.JWT_SECRET, {
      expiresIn: cookieExpirationTimeInSeconds,
    });
  }

  if (conta.usuario) {
    token = jwt.sign({ id: conta.usuario.id, email: conta.email, role: conta.tipo }, process.env.JWT_SECRET, {
      expiresIn: cookieExpirationTimeInSeconds,
    });
  }

  return `Bearer ${token}`;
};

export {
  gerarResetToken,
  gerarHashSenha,
  cookieExpirationTimeInHours,
  cookieExpirationTimeInMilliseconds,
  criarAcessToken,
};
