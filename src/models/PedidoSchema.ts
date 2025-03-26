import { z } from 'zod';

import { ProdutoResponseSchema } from './ProdutoSchema';
import { SeboResponseSchema } from './SeboSchema';

export const StatusPedido = z.enum(['PENDENTE', 'CONCLUIDO', 'CANCELADO']);
export const StatusProdutoPedido = z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO']);

const PedidoProdutoBaseSchema = z.object({
  produtoId: z.number().int().positive(),
  quantidade: z.number().int().min(1),
  status: StatusProdutoPedido.default('PENDENTE'),
  produto: ProdutoResponseSchema.optional(),
});

export const PedidoCreateSchema = z.object({
  seboId: z.number().int().positive(),
  usuarioId: z.number().int().positive(),
  status: StatusPedido.default('PENDENTE'),
  qtdProdutos: z.number().int().min(1),
  total: z.number().positive(),
  produtos: z.array(PedidoProdutoBaseSchema).min(1),
});

export const PedidoResponseSchema = PedidoCreateSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().or(z.string().datetime()),
  updatedAt: z.date().or(z.string().datetime()),
  sebo: SeboResponseSchema,
  produtos: z.array(
    PedidoProdutoBaseSchema.extend({
      produto: ProdutoResponseSchema,
    }),
  ),
});

export type PedidoCreateDTO = z.infer<typeof PedidoCreateSchema>;
export type PedidoResponseDTO = z.infer<typeof PedidoResponseSchema>;
export type PedidoProdutoDTO = z.infer<typeof PedidoProdutoBaseSchema>;
