import { z } from 'zod';
import { optionalString, requiredString } from '@src/utils/zodTypes';

import { ContaCreateSchema, ContaResponseSchema } from './ContaSchema';

const EnderecoSeboSchema = z.object({
  cep: z.string().length(8),
  estado: z.string().length(2),
  cidade: requiredString,
  bairro: requiredString,
  rua: requiredString,
  numero: requiredString,
  complemento: optionalString,
  ehPublico: z.boolean(),
});

const FotoSeboSchema = z.object({
  url: z.string().url(),
});

export const SeboCreateSchema = z.object({
  nome: requiredString,
  cpfCnpj: z.string().min(11).max(16),
  concordaVender: z.boolean(),
  telefone: z.string().max(11).nullable().optional(),

  biografia: optionalString,
  estanteVirtual: optionalString,
  instagram: optionalString,
  curadores: optionalString,
  historia: optionalString,
  fotoPerfil: optionalString,
  mercadoLivre: optionalString,
  enjoei: optionalString,
  amazon: optionalString,

  conta: ContaCreateSchema,
  endereco: EnderecoSeboSchema,
  fotos: z.array(FotoSeboSchema).nullable().optional(),
});

export const SeboResponseSchema = SeboCreateSchema.extend({
  id: z.number(),
  conta: ContaResponseSchema.nullable().optional(),
});

export const SeboUpdateSchema = SeboCreateSchema.extend({
  conta: ContaResponseSchema.nullable().optional(),
});

export type SeboCreateDTO = z.infer<typeof SeboCreateSchema>;
export type SeboUpdateDTO = z.infer<typeof SeboUpdateSchema>;
