import { z } from 'zod';
import { ProdutoAgrupadoSchema } from '@src/utils/groupBySebo';

import { ProdutoBaseSchema } from './BaseSchema';

export const FavoritoCreateSchema = z.object({
  produtoId: z.number(),
});

export const FavoritoResponseSchema = FavoritoCreateSchema;

export const FavoritoAgrupadoSchema = ProdutoAgrupadoSchema(ProdutoBaseSchema);

export type FavoritoCreateDTO = z.infer<typeof FavoritoCreateSchema>;
