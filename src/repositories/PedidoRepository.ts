import prismaClient from '@src/lib/prismaClient';
import { TipoConta } from '@prisma/client';
import { PedidoCreateDTO, PedidoUpdateDTO } from '@src/models/PedidoSchema';
import { buildWhereClause, Filter } from '@src/utils/filterUtils';

const includeAllRelations = {
  include: {
    produtos: { include: { produto: true } },
    sebo: true,
    usuario: true,
  },
};

class PedidoRepository {
  async create(data: PedidoCreateDTO, usuarioId: number) {
    const { produtos, sebo, ...pedido } = data;

    return prismaClient.$transaction(async tx => {
      const pedidoCriado = await tx.pedido.create({
        data: {
          ...pedido,
          sebo: { connect: { id: sebo.id } },
          usuario: { connect: { id: usuarioId } },
        },
      });

      if (produtos?.length) {
        await tx.pedidoProduto.createMany({
          data: produtos.map(item => ({
            pedidoId: pedidoCriado.id,
            produtoId: item.produto.id,
            quantidade: item.quantidade,
          })),
        });
      }

      return tx.pedido.findUnique({
        where: { id: pedidoCriado.id },
        ...includeAllRelations,
      });
    });
  }

  async getAll(id: number, role: TipoConta, filters: Filter[]) {
    const whereClause = {
      ...(role === TipoConta.SEBO ? { seboId: id } : { usuarioId: id }),
      ...buildWhereClause(filters),
    };

    return prismaClient.pedido.findMany({
      where: whereClause,
      ...includeAllRelations,
    });
  }

  async getById(id: number) {
    return prismaClient.pedido.findUnique({
      where: { id },
      ...includeAllRelations,
    });
  }

  async update(id: number, data: PedidoUpdateDTO) {
    const { produtos, status } = data;

    return prismaClient.$transaction(async tx => {
      await tx.pedido.update({
        where: { id },
        data: { status },
      });

      // pode usar updateMany pro pedidoProduto?
      if (produtos?.length) {
        produtos.forEach(
          async item =>
            await tx.pedidoProduto.update({
              where: {
                pedidoId_produtoId: {
                  pedidoId: id,
                  produtoId: item.produto.id,
                },
              },
              data: { status: item.status },
            }),
        );
      }

      return tx.pedido.findUnique({
        where: { id },
        ...includeAllRelations,
      });
    });
  }
}

export const pedidoRepository = new PedidoRepository();
