import { z } from 'zod';

const TipoContaEnum = z.enum(['SEBO', 'USUARIO']);
const StatusContaEnum = z.enum(['ATIVA', 'EXCLUIDA']);

export const ContaCreateSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(8),
});

export const ContaResponseSchema = z.object({
  id: z.number(),
  tipo: TipoContaEnum,
  status: StatusContaEnum,
});

export type ContaCreateDTO = z.infer<typeof ContaCreateSchema>;
