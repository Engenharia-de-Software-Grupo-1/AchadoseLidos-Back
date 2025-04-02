import { z } from 'zod';
import { optionalString, requiredString } from '@src/utils/zodTypes';

import { ContaCreateSchema } from './ContaSchema';

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

const SeboSchema = z.object({
  nome: requiredString,
  concordaVender: z.boolean(),
  telefone: z.string().max(13).nullable().optional(),

  biografia: optionalString,
  horarioFuncionamento: optionalString,
  estanteVirtual: optionalString,
  instagram: optionalString,
  curadores: optionalString,
  historia: optionalString,
  fotoPerfil: optionalString,
  mercadoLivre: optionalString,
  enjoei: optionalString,
  amazon: optionalString,

  endereco: EnderecoSeboSchema,
});

const SeboPrivateSchema = z.object({
  cpfCnpj: z.string().min(11).max(16),
});

export const SeboCreateSchema = SeboSchema.merge(SeboPrivateSchema).extend({
  conta: z.lazy(() => ContaCreateSchema),
});

export const SeboUpdateSchema = SeboSchema.merge(SeboPrivateSchema).extend({
  fotos: z.array(FotoSeboSchema).nullable().optional(),
});

export const SeboResponseSchema = SeboSchema.extend({
  id: z.number(),
  fotos: z.array(FotoSeboSchema).nullable().optional(),
}).transform(data => {
  const { telefone, endereco, ...rest } = data;
  return {
    ...rest,
    id: data.id,
    ...(data.concordaVender ? { telefone } : {}),
    ...(endereco && endereco.ehPublico ? { endereco } : {}),
  };
});

export const SeboPrivateResponseSchema = SeboSchema.merge(SeboPrivateSchema).extend({
  id: z.number(),
});

export type SeboCreateDTO = z.infer<typeof SeboCreateSchema>;
export type SeboUpdateDTO = z.infer<typeof SeboUpdateSchema>;
