import { z } from 'zod';

import { ContaCreateSchema, ContaResponseSchema } from './ContaSchema';

const requiredString = z.string().nonempty();
const optionalString = z.string().nullable().optional();

export const UsuarioCreateSchema = z.object({
  nome: requiredString,
  cpf: z.string().length(11),
  telefone: z.string().length(11),

  biografia: optionalString,
  twitter: optionalString,
  instagram: optionalString,
  skoob: optionalString,
  goodreads: optionalString,
  fotoPerfil: optionalString,

  conta: ContaCreateSchema,
});

export const UsuarioResponseSchema = UsuarioCreateSchema.extend({
  id: z.number(),
  conta: ContaResponseSchema.nullable().optional(),
});

export const UsuarioUpdateSchema = UsuarioResponseSchema;

export type UsuarioCreateDTO = z.infer<typeof UsuarioCreateSchema>;
export type UsuarioUpdateDTO = z.infer<typeof UsuarioUpdateSchema>;
