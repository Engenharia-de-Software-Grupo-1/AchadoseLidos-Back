import prismaClient from '@src/lib/prismaClient';
import { ProdutoCreateDTO, ProdutoUpdateDTO } from '@src/models/ProdutoSchema';
import { Prisma, StatusProduto } from '@prisma/client';
import { DELETED_PRODUTO } from '@src/constants/deletedData';

const includeFotosAndSebo = {
  include: {
    fotos: true,
    sebo: { include: { endereco: true } },
  },
};

class ProdutoRepository {
  async create(data: ProdutoCreateDTO, authTokenId: number) {
    const { fotos, ...produto } = data;

    return prismaClient.$transaction(async tx => {
      const produtoCriado = await tx.produto.create({
        data: { ...produto, sebo: { connect: { id: authTokenId } } },
      });

      if (fotos?.length) {
        await tx.fotoProduto.createMany({
          data: fotos.map(foto => ({ url: foto.url, produtoId: produtoCriado.id })),
        });
      }

      return tx.produto.findUnique({
        where: { id: produtoCriado.id },
        ...includeFotosAndSebo,
      });
    });
  }

  async getAll() {
    return prismaClient.produto.findMany({
      where: { status: StatusProduto.ATIVO },
      ...includeFotosAndSebo,
    });
  }

  async getById(id: number) {
    return prismaClient.produto.findUnique({
      where: { id },
      ...includeFotosAndSebo,
    });
  }

  async update(id: number, data: ProdutoUpdateDTO) {
    const { fotos, ...produto } = data;

    return prismaClient.$transaction(async tx => {
      await Promise.all([
        tx.produto.update({ where: { id }, data: produto }),
        tx.fotoProduto.deleteMany({ where: { produtoId: id } }),
      ]);

      if (fotos?.length) {
        await tx.fotoProduto.createMany({
          data: fotos.map(foto => ({ url: foto.url, produtoId: id })),
        });
      }

      return tx.produto.findUnique({
        where: { id },
        ...includeFotosAndSebo,
      });
    });
  }

  async delete(id: number, tx: Prisma.TransactionClient = prismaClient) {
    await Promise.all([
      tx.fotoProduto.deleteMany({ where: { produtoId: id } }),
      tx.produto.update({
        where: { id },
        data: DELETED_PRODUTO,
      }),
    ]);
  }
}

export const produtoRepository = new ProdutoRepository();
