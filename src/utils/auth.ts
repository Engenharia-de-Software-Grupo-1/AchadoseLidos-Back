import crypto from 'crypto';
import bcrypt, { genSalt } from 'bcrypt';

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
