import prismaClient from '@src/lib/prismaClient';
import { Prisma } from '@prisma/client';
import { CestaAgrupada, CestaUpdateDTO, ProdutoCesta } from '@src/models/CestaSchema';

class CestaRepository {
  async getCesta(usuarioId: number) {
    const cestaProdutos = await prismaClient.cestaProduto.findMany({
      where: { usuarioId },
      include: {
        produto: { include: { sebo: true, fotos: true } },
      },
    });

    return this.agruparProdutosPorSebo(cestaProdutos);
  }

  async addProduto(usuarioId: number, produtoId: number) {
    return prismaClient.cestaProduto.create({
      data: { quantidade: 1, usuarioId, produtoId },
    });
  }

  async getProduto(usuarioId: number, produtoId: number) {
    return prismaClient.cestaProduto.findUnique({
      where: {
        usuarioId_produtoId: {
          usuarioId,
          produtoId,
        },
      },
    });
  }

  async updateProduto(usuarioId: number, produtoId: number, data: CestaUpdateDTO) {
    return prismaClient.cestaProduto.update({
      where: {
        usuarioId_produtoId: {
          usuarioId,
          produtoId,
        },
      },
      data,
    });
  }

  async deleteProduto(usuarioId: number, produtoId: number) {
    await prismaClient.cestaProduto.delete({
      where: {
        usuarioId_produtoId: {
          usuarioId,
          produtoId,
        },
      },
    });
  }

  async deleteAllProdutos(tx: Prisma.TransactionClient, usuarioId: number) {
    await tx.cestaProduto.deleteMany({
      where: { usuarioId },
    });
  }

  private agruparProdutosPorSebo(cestaProdutos: ProdutoCesta[]) {
    const produtosAgrupados = cestaProdutos.reduce((acc: CestaAgrupada, item: ProdutoCesta) => {
      const seboId = item.produto.sebo.id;

      if (!acc[seboId]) {
        acc[seboId] = { sebo: item.produto.sebo, produtos: [] };
      }
      acc[seboId].produtos.push(item);

      return acc;
    }, {} as CestaAgrupada);

    return Object.values(produtosAgrupados);
  }
}

export const cestaRepository = new CestaRepository();
