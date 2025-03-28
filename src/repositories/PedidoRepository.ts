import prismaClient from '@src/lib/prismaClient';
import { PedidoCreateDTO } from '@src/models/PedidoSchema';

export class PedidoRepository {
  async create(data: PedidoCreateDTO) {
    const sebo = await prismaClient.sebo.findUnique({
      where: { id: data.seboId },
      select: { nome: true, telefone: true },
    });
    return prismaClient.pedido.create({
      data: {
        seboId: data.seboId,
        usuarioId: data.usuarioId,
        status: data.status,
        qtdProdutos: data.qtdProdutos,
        total: data.total,
        produtos: {
          create: data.produtos.map(p => ({
            produtoId: p.produtoId,
            quantidade: p.quantidade,
            status: p.status,
          })),
        },
      },
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async getAll() {
    return await prismaClient.pedido.findMany({
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async getById(id: number) {
    return await prismaClient.pedido.findUnique({
      where: { id },
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async updateStatus(id: number, status: string) {
    return await prismaClient.pedido.update({
      where: { id },
      data: { status },
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    });
  }
}

export const pedidoRepository = new PedidoRepository();
