import { z } from "zod";
import { optionalString, optionalStringWithLength, requiredBoolean, requiredString, requiredStringWithLength, requiredStringWithRange } from "@src/utils/zodUtils";

import { contaSchema } from "./ContaSchema";

const enderecoSchema = z.object({
  cep: requiredStringWithLength(8),
  estado: requiredStringWithLength(2),
  cidade: requiredString(),
  bairro: requiredString(),
  rua: requiredString(),
  numero: requiredString(),
  complemento: optionalString(),
  isPublic: requiredBoolean(),
});

const fotoSchema = z.object({
  url: requiredString().url({ message: "URL inválida" }),
});

const seboSchema = z.object({
  nome: requiredString(),
  cpfCnpj: requiredStringWithRange(11, 16),
  concordaVender: requiredBoolean(),
  telefone: optionalStringWithLength(11),
  biografia: optionalString(),
  estanteVirtual: optionalString(),
  instagram: optionalString(),
  curadores: optionalString(),
  historia: optionalString(),
  fotoPerfil: z.string().url({ message: "URL inválida" }).optional(),

  conta: contaSchema,
  endereco: enderecoSchema,
  fotos: z.array(fotoSchema).optional(),
});

export const seboCreateSchema = seboSchema.omit( { fotos: true } );
export const seboUpdateSchema = seboSchema.omit( { conta: true } );

export type SeboCreateDTO = z.infer<typeof seboCreateSchema>;
export type SeboUpdateDTO = z.infer<typeof seboUpdateSchema>;
