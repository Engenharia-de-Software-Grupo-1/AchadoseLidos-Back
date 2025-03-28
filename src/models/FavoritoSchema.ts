import { z } from 'zod';
import { ProdutoAgrupadoSchema, ProdutoBaseSchema } from '@src/utils/groupBySebo';

export const FavoritoCreateSchema = z.object({
  produtoId: z.number(),
});

export const FavoritoResponseSchema = FavoritoCreateSchema;

export const FavoritoAgrupadoSchema = ProdutoAgrupadoSchema(
  z.object({
    produto: ProdutoBaseSchema,
  }),
);

export type FavoritoCreateDTO = z.infer<typeof FavoritoCreateSchema>;
