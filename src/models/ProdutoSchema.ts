import { z } from 'zod';

const requiredString = z.string().nonempty();
const optionalString = z.string().nullable().optional();
const StatusProdutoEnum = z.enum(['ATIVO', 'EXCLUIDO']);
const CategoriaProduto = z.enum(['LIVRO', 'DISCO', 'CD', 'DVD', 'REVISTA', 'GIBI']);
const EstadoConservacaoProduto = z.enum(['NOVO', 'EXECELENTE', 'BOM', 'ACEITAVEL', 'RUIM']);
const ProdutoFotoSchema = z.object({
  url: z.string().url(),
});

export const ProdutoCreateSchema = z.object({
  seboId: z.number().int().positive(),
  status: StatusProdutoEnum,
  nome: requiredString,
  preco: z.number().nonnegative(),
  categoria: CategoriaProduto,
  qtdEstoque: z.number().int().nonnegative(),
  estadoConservacao: EstadoConservacaoProduto,
  anoEdicao: z.number().int().min(1000).max(new Date().getFullYear()),
  anoLancamento: z.number().int().min(1000).max(new Date().getFullYear()),
  autores: optionalString,
  descricao: optionalString,
  fotos: z.array(ProdutoFotoSchema).nullable().optional(),
});

export const ProdutoResponseSchema = ProdutoCreateSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().or(z.string().datetime()),
  updatedAt: z.date().or(z.string().datetime()),
});

export const ProdutoUpdateSchema = ProdutoResponseSchema;

export type ProdutoCreateDTO = z.infer<typeof ProdutoCreateSchema>;
export type ProdutoUpdateDTO = z.infer<typeof ProdutoUpdateSchema>;
