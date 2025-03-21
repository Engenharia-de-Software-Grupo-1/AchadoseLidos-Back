import { z } from 'zod';
import { optionalString, requiredString } from '@src/utils/zodTypes';

import { SeboResponseSchema } from './SeboSchema';

const StatusProdutoEnum = z.enum(['ATIVO', 'EXCLUIDO']);
const CategoriaProduto = z.enum(['LIVRO', 'DISCO', 'CD', 'DVD', 'REVISTA', 'GIBI']);
const EstadoConservacaoProduto = z.enum(['NOVO', 'EXECELENTE', 'BOM', 'ACEITAVEL', 'RUIM']);

const FotoProdutoSchema = z.object({
  url: z.string().url(),
});

export const ProdutoCreateSchema = z.object({
  nome: requiredString,
  preco: z.number().nonnegative(),
  categoria: CategoriaProduto,
  qtdEstoque: z.number().int().nonnegative(),
  estadoConservacao: EstadoConservacaoProduto,
  anoEdicao: z.number().optional().nullable(),
  anoLancamento: z.number().optional().nullable(),
  autores: optionalString,
  descricao: optionalString,

  fotos: z.array(FotoProdutoSchema).nullable().optional(),
});

export const ProdutoUpdateSchema = ProdutoCreateSchema;

export const ProdutoResponseSchema = ProdutoCreateSchema.extend({
  id: z.number(),
  status: StatusProdutoEnum,
  createdAt: z.date().or(z.string().datetime()),
  updatedAt: z.date().or(z.string().datetime()),
  sebo: SeboResponseSchema,
});

export type ProdutoCreateDTO = z.infer<typeof ProdutoCreateSchema>;
export type ProdutoUpdateDTO = z.infer<typeof ProdutoUpdateSchema>;
