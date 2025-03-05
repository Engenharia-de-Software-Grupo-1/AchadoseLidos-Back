import { z } from "zod";

import { contaSchema } from "./ContaSchema";

const enderecoSchema = z.object({
  cep: z.string().length(8),
  estado: z.string().length(2),
  cidade: z.string().nonempty(),
  bairro: z.string().nonempty(),
  rua: z.string().nonempty(),
  numero: z.string().nonempty(),
  complemento: z.string().nullable().optional(),
  isPublic: z.boolean(),
});

const fotoSchema = z.object({
  url: z.string().url(),
});

const seboSchema = z.object({
  nome: z.string(),
  cpfCnpj: z.string().min(11).max(16),
  concordaVender: z.boolean(),
  telefone: z.string().length(11).nullable().optional(),
  biografia: z.string().nullable().optional(),
  estanteVirtual: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  curadores: z.string().nullable().optional(),
  historia: z.string().nullable().optional(),
  fotoPerfil: z.string().url().optional(),

  conta: contaSchema,
  endereco: enderecoSchema,
  fotos: z.array(fotoSchema).optional(),
});

export const seboCreateSchema = seboSchema.omit( { fotos: true } );
export const seboUpdateSchema = seboSchema.omit( { conta: true } );

export type SeboCreateDTO = z.infer<typeof seboCreateSchema>;
export type SeboUpdateDTO = z.infer<typeof seboUpdateSchema>;
