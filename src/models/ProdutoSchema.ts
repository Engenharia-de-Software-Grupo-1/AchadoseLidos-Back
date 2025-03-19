import { z } from 'zod';
import { optionalString, requiredString } from '@src/utils/zodTypes';

const StatusProdutoEnum = z.enum(['ATIVO', 'EXCLUIDO']);
const CategoriaProduto = z.enum(['LIVRO', 'DISCO', 'CD', 'DVD', 'REVISTA', 'GIBI']);
const EstadoConservacaoProduto = z.enum(['NOVO', 'EXECELENTE', 'BOM', 'ACEITAVEL', 'RUIM']);

const FotoProdutoSchema = z.object({
  url: z.string().url(),
});

export const ProdutoCreateSchema = z.object({
  nome: requiredString,
  status: StatusProdutoEnum,
  preco: z.number().nonnegative(),
  categoria: CategoriaProduto,
  qtdEstoque: z.number().int().nonnegative(),
  estadoConservacao: EstadoConservacaoProduto,
  anoEdicao: z.number().int().min(1000).max(new Date().getFullYear()),
  anoLancamento: z.number().int().min(1000).max(new Date().getFullYear()),
  autores: optionalString,
  descricao: optionalString,
  fotos: z.array(FotoProdutoSchema).nullable().optional(),
});

export const ProdutoResponseSchema = ProdutoCreateSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().or(z.string().datetime()),
  updatedAt: z.date().or(z.string().datetime()),
});

export const ProdutoUpdateSchema = ProdutoResponseSchema;

export type ProdutoCreateDTO = z.infer<typeof ProdutoCreateSchema>;
export type ProdutoUpdateDTO = z.infer<typeof ProdutoUpdateSchema>;
