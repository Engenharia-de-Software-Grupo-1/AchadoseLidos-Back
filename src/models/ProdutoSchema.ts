import { z } from 'zod';
import { optionalString, requiredString } from '@src/utils/zodTypes';

import { SeboResponseSchema } from './SeboSchema';

export const CategoriaProduto = z.enum(['LIVRO', 'REVISTA', 'QUADRINHOS', 'DISCO', 'CD', 'DVD', 'OUTRO']);
const EstadoConservacaoProduto = z.enum(['NOVO', 'SEMINOVO', 'USADO', 'DESCONHECIDO']);

export const FotoProdutoSchema = z.object({
  url: z.string().url(),
});

export const ProdutoCreateSchema = z.object({
  nome: requiredString,
  preco: z.number().nonnegative(),
  categoria: CategoriaProduto,
  generos: z.array(z.string()).nonempty(),
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
  createdAt: z.date().or(z.string().datetime()),
  updatedAt: z.date().or(z.string().datetime()),
  sebo: SeboResponseSchema,
});

export type ProdutoCreateDTO = z.infer<typeof ProdutoCreateSchema>;
export type ProdutoUpdateDTO = z.infer<typeof ProdutoUpdateSchema>;
