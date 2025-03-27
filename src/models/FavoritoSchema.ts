import { z } from 'zod';

import { CategoriaProduto } from './ProdutoSchema';

export const FavoritoCreateSchema = z.object({
  produtoId: z.number(),
});

export const FavoritoResponseSchema = z.object({
  id: z.number(),
  produto: z.object({
    id: z.number(),
    nome: z.string(),
    preco: z.number(),
    status: z.string(),
    categoria: CategoriaProduto,
    generos: z.array(z.string()),
    qtdEstoque: z.number(),
    estadoConservacao: z.string(),
    anoEdicao: z.number().nullable(),
    anoLancamento: z.number().nullable(),
    autores: z.string(),
    descricao: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    seboId: z.number(),
  }),
});

export type FavoritoCreateDTO = z.infer<typeof FavoritoCreateSchema>;
export type FavoritoResponseDTO = z.infer<typeof FavoritoResponseSchema>;
