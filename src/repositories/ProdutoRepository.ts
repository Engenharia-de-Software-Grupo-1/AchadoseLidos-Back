import prismaClient from '@src/lib/prismaClient';
import { ProdutoCreateDTO, ProdutoUpdateDTO } from '@src/models/ProdutoSchema';
import { StatusProduto } from '@prisma/client';

class ProdutoRepository {
  async create(data: ProdutoCreateDTO, authenticatedSeboId: number) {
    const { fotos, ...produto } = data;

    return prismaClient.$transaction(async tx => {
      const produtoCriado = await tx.produto.create({
        data: { ...produto, sebo: { connect: { id: authenticatedSeboId } } },
      });

      if (fotos && fotos.length > 0) {
        await tx.fotoProduto.createMany({
          data: fotos.map(foto => ({ url: foto.url, produtoId: produtoCriado.id })),
        });
      }

      return tx.produto.findUnique({
        where: { id: produtoCriado.id },
        include: { fotos: true },
      });
    });
  }

  async getAll() {
    return prismaClient.produto.findMany({
      where: { status: StatusProduto.ATIVO },
      include: {
        fotos: true,
        sebo: {
          include: {
            endereco: true,
          },
        },
      },
    });
  }

  async getById(id: number) {
    return prismaClient.produto.findUnique({
      where: { id },
      include: {
        fotos: true,
        sebo: {
          include: {
            endereco: true,
          },
        },
      },
    });
  }

  async update(id: number, data: ProdutoUpdateDTO) {
    const { fotos, ...produto } = data;

    return prismaClient.$transaction(async tx => {
      await Promise.all([
        tx.produto.update({ where: { id }, data: produto }),
        tx.fotoProduto.deleteMany({ where: { produtoId: id } }),
      ]);

      if (fotos && fotos.length > 0) {
        await tx.fotoProduto.createMany({
          data: fotos.map(foto => ({ url: foto.url, produtoId: id })),
        });
      }

      return tx.produto.findUnique({
        where: { id },
        include: {
          fotos: true,
          sebo: {
            include: {
              endereco: true,
            },
          },
        },
      });
    });
  }

  async atualizarStatus(id: number, status: StatusProduto) {
    return prismaClient.produto.update({
      where: { id },
      data: { status },
    });
  }
}

export const produtoRepository = new ProdutoRepository();
