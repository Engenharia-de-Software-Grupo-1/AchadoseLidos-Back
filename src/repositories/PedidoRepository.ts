import prismaClient from '@src/lib/prismaClient';
import { PedidoCreateDTO } from '@src/models/PedidoSchema';

class PedidoRepository {
  async create(data: PedidoCreateDTO) {
    return prismaClient.$transaction(async tx => {
      const pedido = await tx.pedido.create({
        data: {
          seboId: data.seboId,
          usuarioId: data.usuarioId,
          status: data.status,
          qtdProdutos: data.qtdProdutos,
          total: data.total,
        },
      });

      const produtosValidos = await tx.produto.findMany({
        where: { id: { in: data.produtos.map(p => p.produtoId) } },
        select: { id: true },
      });

      const idsValidos = new Set(produtosValidos.map(p => p.id));

      const produtosPedido = data.produtos
        .filter(p => idsValidos.has(p.produtoId))
        .map(p => ({
          pedidoId: pedido.id,
          produtoId: p.produtoId,
          quantidade: p.quantidade,
          status: p.status,
        }));

      if (!produtosPedido.length) throw new Error('Nenhum produto válido foi encontrado.');

      await tx.pedidoProduto.createMany({ data: produtosPedido });

      return tx.pedido.findUnique({
        where: { id: pedido.id },
        include: {
          produtos: { include: { produto: true } },
          sebo: true,
          usuario: true,
        },
      });
    });
  }

  async getById(id: number) {
    return prismaClient.pedido.findUnique({
      where: { id },
      include: {
        produtos: { include: { produto: true } },
        sebo: true,
        usuario: true,
      },
    });
  }
}

export const pedidoRepository = new PedidoRepository();
