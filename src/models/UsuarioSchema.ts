import { z } from 'zod';
import { optionalString, requiredString } from '@src/utils/zodTypes';

import { ContaCreateSchema } from './ContaSchema';

const UsuarioSchema = z.object({
  nome: requiredString,
  biografia: optionalString,
  twitter: optionalString,
  instagram: optionalString,
  skoob: optionalString,
  goodreads: optionalString,
  fotoPerfil: optionalString,
});

const UsuarioPrivateSchema = z.object({
  cpf: z.string().length(11),
  telefone: z.string().length(11),
});

export const UsuarioCreateSchema = UsuarioSchema.merge(UsuarioPrivateSchema).extend({
  conta: z.lazy(() => ContaCreateSchema),
});

export const UsuarioUpdateSchema = UsuarioSchema.merge(UsuarioPrivateSchema);

export const UsuarioResponseSchema = UsuarioSchema.extend({
  id: z.number(),
});

export const UsuarioPrivateResponseSchema = UsuarioSchema.merge(UsuarioPrivateSchema).extend({
  id: z.number(),
});

export type UsuarioCreateDTO = z.infer<typeof UsuarioCreateSchema>;
export type UsuarioUpdateDTO = z.infer<typeof UsuarioUpdateSchema>;
