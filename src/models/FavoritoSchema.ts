import { z } from 'zod';

import { CategoriaProduto } from './ProdutoSchema';

export const FavoritoCreateSchema = z.object({
  produtoId: z.number(),
});

export const FavoritoResponseSchema = z.array(
  z.object({
    sebo: z.object({
      id: z.number(),
      nome: z.string(),
    }),
    produtos: z.array(
      z.object({
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
          createdAt: z.date(),
          updatedAt: z.date(),
          seboId: z.number(),
          fotos: z.array(
            z.object({
              id: z.number(),
              url: z.string(),
              produtoId: z.number(),
            }),
          ),
        }),
      }),
    ),
  }),
);

export type FavoritoCreateDTO = z.infer<typeof FavoritoCreateSchema>;
export type FavoritoResponseDTO = z.infer<typeof FavoritoResponseSchema>;
