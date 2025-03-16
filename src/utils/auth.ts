import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt, { genSalt } from 'bcrypt';
import { AppError } from '@src/errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '1h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não definido no .env');
}

export const gerarToken = (email: string) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
};

export const verificarToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return decoded.email;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expirado', 401);
    }
    throw new AppError('Token inválido', 400);
  }
};

export const gerarResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);
  return { token, expiresAt };
};

export const gerarHashSenha = async (senha: string) => {
  const salt = await genSalt(10);
  return await bcrypt.hash(senha, salt);
};
