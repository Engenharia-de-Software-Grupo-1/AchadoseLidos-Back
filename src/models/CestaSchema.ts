import { z } from 'zod';

import { CategoriaProduto, FotoProdutoSchema } from './ProdutoSchema';

export const CestaCreateSchema = z.object({
  produtoId: z.number(),
});

export const CestaUpdateSchema = z.object({
  quantidade: z.number().int().nonnegative(),
});

export const CestaResponseSchema = CestaCreateSchema.merge(CestaUpdateSchema);

export type CestaCreateDTO = z.infer<typeof CestaCreateSchema>;
export type CestaUpdateDTO = z.infer<typeof CestaUpdateSchema>;

const SeboCestaSchema = z.object({
  id: z.number(),
  nome: z.string(),
});

const ProdutoCestaSchema = z.object({
  quantidade: z.number().int().nonnegative(),
  produto: z.object({
    id: z.number(),
    fotos: z.array(FotoProdutoSchema).nullable().optional(),
    nome: z.string(),
    categoria: CategoriaProduto,
    preco: z.number().nonnegative(),
    qtdEstoque: z.number().int().nonnegative(),
  }),
});

export const CestaAgrupadaSchema = z.object({
  sebo: SeboCestaSchema,
  produtos: z.array(ProdutoCestaSchema),
});

export type SeboCesta = z.infer<typeof SeboCestaSchema>;
export type ProdutoCesta = z.infer<typeof ProdutoCestaSchema> & {
  produto: {
    sebo: SeboCesta;
  };
};
export type CestaAgrupada = Record<number, { sebo: SeboCesta; produtos: ProdutoCesta[] }>;
