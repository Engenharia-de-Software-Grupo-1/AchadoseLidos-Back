import { z } from 'zod';

import { SeboResponseSchema } from './SeboSchema';
import { UsuarioResponseSchema } from './UsuarioSchema';

const TipoContaEnum = z.enum(['SEBO', 'USUARIO']);
const StatusContaEnum = z.enum(['ATIVA', 'EXCLUIDA']);

export const ContaCreateSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(8),
});

export const ContaUpdateSchema = z.object({
  senha: z.string().min(8),
  token: z.string(),
});

export const ContaResponseSchema = z.object({
  id: z.number(),
  tipo: TipoContaEnum,
  status: StatusContaEnum,
  createdAt: z.date().or(z.string().datetime()),
  updatedAt: z.date().or(z.string().datetime()),
});

export const ContaInformacoesResponseSchema = ContaResponseSchema.extend({
  sebo: z
    .lazy(() => SeboResponseSchema)
    .nullable()
    .optional(),
  usuario: z
    .lazy(() => UsuarioResponseSchema)
    .nullable()
    .optional(),
});

export type ContaCreateDTO = z.infer<typeof ContaCreateSchema>;
export type ContaUpdateDTO = z.infer<typeof ContaUpdateSchema>;
