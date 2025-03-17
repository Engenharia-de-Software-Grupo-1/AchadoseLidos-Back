import { z } from 'zod';

const requiredString = z.string().nonempty();
const optionalString = z.string().nullable().optional();

const ProdutoFotoSchema = z.object({
  url: z.string().url(),
});

export const ProdutoCreateSchema = z.object({
  seboId: z.number().int().positive(),
  status: z.enum(['ATIVO', 'EXCLUIDO']),
  nome: requiredString.max(255),
  preco: z.number().nonnegative(),
  categoria: z.enum(['GIBI', 'REVISTA', 'DVD']),
  qtdEstoque: z.number().int().nonnegative(),
  estadoConservacao: z.enum(['NOVO', 'EXECELENTE', 'BOM', 'ACEITAVEL', 'RUIM']),
  anoEdicao: z.number().int().min(1000).max(new Date().getFullYear()),
  anoLancamento: z.number().int().min(1000).max(new Date().getFullYear()),
  autores: optionalString,
  descricao: optionalString,
  fotos: z.array(ProdutoFotoSchema).nullable().optional(),
});

export const ProdutoResponseSchema = ProdutoCreateSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().or(z.string().datetime()),
  updatedAt: z.date().or(z.string().datetime()).nullable().optional(),
});

export const ProdutoUpdateSchema = ProdutoResponseSchema.partial();

export type ProdutoCreateDTO = z.infer<typeof ProdutoCreateSchema>;
export type ProdutoUpdateDTO = z.infer<typeof ProdutoUpdateSchema>;
