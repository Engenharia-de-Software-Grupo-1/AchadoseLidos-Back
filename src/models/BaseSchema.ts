import { z } from 'zod';

import { CategoriaProduto, FotoProdutoSchema } from './ProdutoSchema';

export const SeboBaseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  concordaVender: z.boolean(),
  telefone: z.string().max(13),
});

export const UsuarioBaseSchema = z.object({
  id: z.number(),
  nome: z.string(),
});

export const ProdutoBaseSchema = z.object({
  id: z.number(),
  fotos: z.array(FotoProdutoSchema).nullable().optional(),
  nome: z.string(),
  categoria: CategoriaProduto,
  preco: z.number().nonnegative(),
  qtdEstoque: z.number().int().nonnegative(),
});

export type Sebo = z.infer<typeof SeboBaseSchema>;
export type Usuario = z.infer<typeof UsuarioBaseSchema>;
export type Produto = z.infer<typeof ProdutoBaseSchema>;
