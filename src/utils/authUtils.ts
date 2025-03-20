import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Conta, Sebo, Usuario } from '@prisma/client';
import { InvalidTokenError } from '@src/errors/InvalidTokenError';
import { NoPermissionError } from '@src/errors/NoPermissionError';
import { InternalServerError } from '@src/errors/InternalServerError';

type ContaWithRelations = Conta & {
  sebo?: Sebo | null;
  usuario?: Usuario | null;
};

export const COOKIE_EXPIRATION_HOURS = 1;
export const COOKIE_EXPIRATION_SECONDS = COOKIE_EXPIRATION_HOURS * 60 * 60;
export const COOKIE_EXPIRATION_MS = COOKIE_EXPIRATION_SECONDS * 1000;

export const gerarResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + COOKIE_EXPIRATION_MS);
  return { token, expiresAt };
};

export const gerarHashSenha = async (senha: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(senha, salt);
};

export const gerarAuthToken = (conta: ContaWithRelations) => {
  if (!process.env.JWT_SECRET) {
    throw new InternalServerError();
  }

  const payload = {
    id: conta.sebo?.id || conta.usuario?.id,
    contaId: conta.id,
    email: conta.email,
    role: conta.tipo,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: COOKIE_EXPIRATION_SECONDS,
  });

  return `Bearer ${token}`;
};

export const getAuthTokenId = (authToken: unknown) => {
  if (!authToken || typeof authToken !== 'object' || !('id' in authToken)) {
    throw new InvalidTokenError();
  }
  return Number(authToken.id);
};

export const ensureSelfTargetedAction = (id: number, authToken: unknown) => {
  const authTokenId = getAuthTokenId(authToken);
  if (id !== authTokenId) {
    throw new NoPermissionError();
  }
};
