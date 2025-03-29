import { z } from 'zod';
import { CategoriaProduto, FotoProdutoSchema } from '@src/models/ProdutoSchema';

export const SeboBaseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  concordaVender: z.boolean(),
});
type Sebo = z.infer<typeof SeboBaseSchema>;

export const ProdutoBaseSchema = z.object({
  id: z.number(),
  fotos: z.array(FotoProdutoSchema).nullable().optional(),
  nome: z.string(),
  categoria: CategoriaProduto,
  preco: z.number().nonnegative(),
  qtdEstoque: z.number().int().nonnegative(),
});

export const ProdutoAgrupadoSchema = <T extends z.ZodTypeAny>(produtoSchema: T) =>
  z.object({
    sebo: SeboBaseSchema,
    produtos: z.array(produtoSchema),
  });

export function groupBySebo<T extends { produto: { sebo: Sebo } }>(items: T[], mapProduto: (item: T) => unknown) {
  return Object.values(
    items.reduce<Record<number, { sebo: Sebo; produtos: unknown[] }>>((acc, item) => {
      const seboId = item.produto.sebo.id;
      acc[seboId] = acc[seboId] || { sebo: item.produto.sebo, produtos: [] };
      acc[seboId].produtos.push(mapProduto(item));
      return acc;
    }, {}),
  );
}
