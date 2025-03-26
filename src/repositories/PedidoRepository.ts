import prismaClient from '@src/lib/prismaClient';
import { PedidoCreateDTO } from '@src/models/PedidoSchema';

class PedidoRepository {
  async create(data: PedidoCreateDTO) {
    return prismaClient.$transaction(async tx => {
      // ✅ Criação do pedido
      const pedido = await tx.pedido.create({
        data: {
          seboId: data.seboId,
          usuarioId: data.usuarioId,
          status: data.status,
          qtdProdutos: data.qtdProdutos,
          total: data.total,
        },
      });

      // ✅ Busca os produtos válidos
      const produtosValidos = await tx.produto.findMany({
        where: { id: { in: data.produtos.map(p => p.produtoId) } },
        select: { id: true, nome: true, preco: true, categoria: true, qtdeEstoque: true },
      });

      const idsValidos = produtosValidos.map(p => p.id);

      // ✅ Criação dos produtos no pedido
      const produtosPedido = data.produtos
        .filter(p => idsValidos.includes(p.produtoId))
        .map(p => ({
          produtoId: p.produtoId,
          quantidade: p.quantidade,
          status: p.status,
        }));

      if (produtosPedido.length === 0) {
        throw new Error('Nenhum produto válido foi encontrado.');
      }

      await tx.pedidoProduto.createMany({
        data: produtosPedido,
      });

      // ✅ Retorna o pedido completo
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
