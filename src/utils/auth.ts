import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppError } from '@src/errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '1h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não definido no .env');
}

export const gerarToken = (email: string) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
  return { token, expiresAt };
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

export const gerarHashSenha = async (senha: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(senha, saltRounds);
};
