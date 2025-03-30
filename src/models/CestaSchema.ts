import { z } from 'zod';
import { ProdutoAgrupadoSchema } from '@src/utils/groupBySebo';

import { ProdutoBaseSchema } from './BaseSchema';

export const CestaCreateSchema = z.object({
  produtoId: z.number(),
});

export const CestaUpdateSchema = z.object({
  quantidade: z.number().int().nonnegative(),
});

export const CestaResponseSchema = CestaCreateSchema.merge(CestaUpdateSchema);

export const CestaAgrupadaSchema = ProdutoAgrupadoSchema(
  z.object({
    quantidade: z.number().int().nonnegative(),
    produto: ProdutoBaseSchema,
  }),
);

export type CestaCreateDTO = z.infer<typeof CestaCreateSchema>;
export type CestaUpdateDTO = z.infer<typeof CestaUpdateSchema>;
