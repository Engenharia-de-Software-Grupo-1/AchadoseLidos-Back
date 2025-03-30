import { z } from 'zod';
import { Sebo, SeboBaseSchema } from '@src/models/BaseSchema';

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
