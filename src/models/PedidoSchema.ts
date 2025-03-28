import { z } from 'zod';
import { StatusPedido, StatusProdutoPedido } from '@prisma/client';

export const PedidoProdutoSchema = z.object({
  produtoId: z.number().int().positive(),
  quantidade: z.number().int().positive(),
  status: z.nativeEnum(StatusProdutoPedido).default(StatusProdutoPedido.PENDENTE),
});

export const PedidoCreateSchema = z.object({
  seboId: z.number().int().positive(),
  usuarioId: z.number().int().positive(),
  produtos: z.array(PedidoProdutoSchema).nonempty(),
  status: z.nativeEnum(StatusPedido).default(StatusPedido.PENDENTE),
  total: z.number().nonnegative(),
  qtdProdutos: z.number().int().positive(),
});

export type PedidoCreateDTO = z.infer<typeof PedidoCreateSchema>;
