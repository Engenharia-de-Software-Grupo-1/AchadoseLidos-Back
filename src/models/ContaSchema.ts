import { z } from 'zod';

const TipoContaEnum = z.enum(['SEBO', 'USUARIO']);
const StatusContaEnum = z.enum(['ATIVA', 'EXCLUIDA']);

export const ContaCreateSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(8),
});

export const ContaResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  tipo: TipoContaEnum,
  status: StatusContaEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ContaCreateDTO = z.infer<typeof ContaCreateSchema>;
