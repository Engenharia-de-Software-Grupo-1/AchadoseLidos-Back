import { z } from 'zod';
import { ProdutoAgrupadoSchema, ProdutoBaseSchema } from '@src/utils/groupBySebo';

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
