import prismaClient from '@src/lib/prismaClient';
import { ProdutoCreateDTO, ProdutoUpdateDTO } from '@src/models/ProdutoSchema';

class ProdutoRepository {
  async create(data: ProdutoCreateDTO) {
    const { fotos, ...produto } = data;

    return prismaClient.$transaction(async tx => {
      const produtoCriado = await tx.produto.create({
        data: {
          ...produto,
          status: 'ATIVO',
        },
      });

      if (fotos && fotos.length > 0) {
        await tx.produtoFoto.createMany({
          data: fotos.map(foto => ({ url: foto.url, produtoId: produtoCriado.id })),
        });
      }

      return tx.produto.findUnique({
        where: { id: produtoCriado.id },
        include: { produtoFotos: true },
      });
    });
  }

  async getAll() {
    return prismaClient.produto.findMany({
      where: { status: 'ATIVO' },
      include: { produtoFotos: true },
    });
  }

  async getById(id: number) {
    return prismaClient.produto.findUnique({
      where: { id },
      include: { produtoFotos: true },
    });
  }

  async update(id: number, data: ProdutoUpdateDTO) {
    const { fotos, ...produto } = data;

    return prismaClient.$transaction(async tx => {
      await tx.produto.update({ where: { id }, data: produto });
      await tx.produtoFoto.deleteMany({ where: { produtoId: id } });

      if (fotos && fotos.length > 0) {
        await tx.produtoFoto.createMany({
          data: fotos.map(foto => ({ url: foto.url, produtoId: id })),
        });
      }

      return tx.produto.findUnique({
        where: { id },
        include: { produtoFotos: true },
      });
    });
  }
}

export const produtoRepository = new ProdutoRepository();
