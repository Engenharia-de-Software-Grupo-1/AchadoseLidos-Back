import { z } from 'zod';

import { ProdutoBaseSchema, SeboBaseSchema, UsuarioBaseSchema } from './BaseSchema';

export const StatusPedido = z.enum(['PENDENTE', 'CONCLUIDO', 'CANCELADO']);
export const StatusProdutoPedido = z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO']);

const PedidoProdutoCreateSchema = z.object({
  quantidade: z.number().int().min(1),
  produto: ProdutoBaseSchema,
});

const PedidoProdutoUpdateSchema = z.object({
  status: StatusProdutoPedido,
  produto: ProdutoBaseSchema,
});

export const PedidoCreateSchema = z.object({
  qtdProdutos: z.number().int().min(1),
  total: z.number().positive(),
  sebo: SeboBaseSchema,
  produtos: z.array(PedidoProdutoCreateSchema).min(1),
});

export const PedidoUpdateSchema = z.object({
  status: StatusPedido,
  produtos: z.array(PedidoProdutoUpdateSchema),
});

export const PedidoResponseSchema = PedidoCreateSchema.extend({
  id: z.number(),
  qtdProdutos: z.number().int().min(1),
  total: z.number().positive(),
  status: StatusPedido,
  createdAt: z.date().or(z.string().datetime()),
  updatedAt: z.date().or(z.string().datetime()),
  produtos: z.array(PedidoProdutoCreateSchema.merge(PedidoProdutoUpdateSchema)),
  sebo: SeboBaseSchema,
  usuario: UsuarioBaseSchema,
});

export type PedidoCreateDTO = z.infer<typeof PedidoCreateSchema>;
export type PedidoUpdateDTO = z.infer<typeof PedidoUpdateSchema>;
