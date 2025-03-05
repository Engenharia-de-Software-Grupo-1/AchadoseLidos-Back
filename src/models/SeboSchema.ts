import { z } from "zod";

import { contaSchema } from "./ContaSchema";

const requiredString = z.string().nonempty();
const optionalString = z.string().nullable().optional();

const enderecoSchema = z.object({
  cep: z.string().length(8),
  estado: z.string().length(2),
  cidade: requiredString,
  bairro: requiredString,
  rua: requiredString,
  numero: requiredString,
  complemento: optionalString,
  ehPublico: z.boolean(),
});

const fotoSchema = z.object({
  url: z.string().url(),
});

const seboSchema = z.object({
  nome: requiredString,
  cpfCnpj: z.string().min(11).max(16),
  concordaVender: z.boolean(),
  telefone: z.string().length(11).nullable().optional(),
  biografia: optionalString,
  estanteVirtual: optionalString,
  instagram: optionalString,
  curadores: optionalString,
  historia: optionalString,
  fotoPerfil: z.string().url().optional(),

  conta: contaSchema,
  endereco: enderecoSchema,
  fotos: z.array(fotoSchema).nullable().optional(),
});

export const seboCreateSchema = seboSchema.omit({ fotos: true });
export const seboUpdateSchema = seboSchema.omit({ conta: true });

export type SeboCreateDTO = z.infer<typeof seboCreateSchema>;
export type SeboUpdateDTO = z.infer<typeof seboUpdateSchema>;
