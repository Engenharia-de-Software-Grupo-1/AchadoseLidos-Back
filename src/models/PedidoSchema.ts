import { z } from 'zod';

import { ProdutoBaseSchema, SeboBaseSchema, UsuarioBaseSchema } from './BaseSchema';

const StatusPedido = z.enum(['PENDENTE', 'CONCLUIDO', 'CANCELADO']);
const StatusProdutoPedido = z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO']);

const ProdutoPedidoSchema = {
  create: z.object({
    quantidade: z.number().int().min(1),
    produto: ProdutoBaseSchema,
  }),
  update: z.object({
    status: StatusProdutoPedido,
    quantidade: z.number().int().min(1),
    produto: ProdutoBaseSchema,
  }),
};

export const PedidoCreateSchema = z.object({
  qtdProdutos: z.number().int().min(1),
  total: z.number().positive(),
  sebo: SeboBaseSchema,
  produtos: z.array(ProdutoPedidoSchema.create).min(1),
});

export const PedidoUpdateSchema = z.object({
  status: StatusPedido,
  produtos: z.array(ProdutoPedidoSchema.update).min(1),
});

export const PedidoResponseSchema = PedidoCreateSchema.extend({
  id: z.number(),
  status: StatusPedido,
  createdAt: z.date().or(z.string().datetime()),
  updatedAt: z.date().or(z.string().datetime()),
  usuario: UsuarioBaseSchema,
  produtos: z.array(ProdutoPedidoSchema.update),
});

export type PedidoCreateDTO = z.infer<typeof PedidoCreateSchema>;
export type PedidoUpdateDTO = z.infer<typeof PedidoUpdateSchema>;
export type PedidoResponseDTO = z.infer<typeof PedidoResponseSchema>;
