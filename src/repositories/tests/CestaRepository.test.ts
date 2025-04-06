import { prismaMock } from '@src/lib/singleton';
import prismaClient from '@src/lib/prismaClient';
import { CestaUpdateDTO } from '@src/models/CestaSchema';

import { cestaRepository } from '../CestaRepository';

describe('CestaRepository', () => {
  it('returns a basket by user id', async () => {
    const cesta = [
      {
        id: 1,
        usuarioId: 123,
        produto: {
          id: 10,
          sebo: { id: 5 },
          fotos: [{ id: 100 }],
        },
      },
    ];

    (prismaClient.cestaProduto.findMany as jest.Mock).mockResolvedValue(cesta);

    const result = await cestaRepository.getCesta(123);

    expect(prismaClient.cestaProduto.findMany).toHaveBeenCalledWith({
      where: { usuarioId: 123 },
      include: { produto: { include: { sebo: true, fotos: true } } },
    });
    expect(result).toEqual(cesta);
  });

  it("adds a product to a user's basket", async () => {
    const cesta = { quantidade: 1, usuarioId: 123, produtoId: 345 };

    (prismaClient.cestaProduto.create as jest.Mock).mockResolvedValue(cesta);

    const result = await cestaRepository.addProduto(cesta.usuarioId, cesta.produtoId);

    expect(prismaClient.cestaProduto.create).toHaveBeenCalledWith({
      data: { quantidade: 1, usuarioId: 123, produtoId: 345 },
    });
    expect(result).toEqual(cesta);
  });

  it("returns a product from a user's basket", async () => {
    const cesta = { usuarioId: 123, produtoId: 345 };

    (prismaClient.cestaProduto.findUnique as jest.Mock).mockResolvedValue(cesta);

    const result = await cestaRepository.getProduto(cesta.usuarioId, cesta.produtoId);

    expect(prismaClient.cestaProduto.findUnique).toHaveBeenCalledWith({
      where: {
        usuarioId_produtoId: {
          usuarioId: 123,
          produtoId: 345,
        },
      },
    });
    expect(result).toEqual(cesta);
  });

  it("updates a product in a user's basket", async () => {
    const data: CestaUpdateDTO = {
      quantidade: 3,
    };

    const cesta = {
      usuarioId: 123,
      produtoId: 345,
      quantidade: 3,
    };

    (prismaClient.cestaProduto.update as jest.Mock).mockResolvedValue(cesta);

    const result = await cestaRepository.updateProduto(123, 345, data);

    expect(prismaClient.cestaProduto.update).toHaveBeenCalledWith({
      where: {
        usuarioId_produtoId: { usuarioId: 123, produtoId: 345 },
      },
      data,
    });
    expect(result).toEqual(cesta);
  });

  it("deletes a product from a user's basket", async () => {
    (prismaClient.cestaProduto.delete as jest.Mock).mockResolvedValue(undefined);

    await cestaRepository.deleteProduto(123, 345);

    expect(prismaClient.cestaProduto.delete).toHaveBeenCalledWith({
      where: {
        usuarioId_produtoId: { usuarioId: 123, produtoId: 345 },
      },
    });
  });

  it("deletes all products from a user's basket by user id", async () => {
    const tx = prismaMock;

    (prismaClient.cestaProduto.deleteMany as jest.Mock).mockResolvedValue(undefined);

    await cestaRepository.deleteAllByUsuarioId(tx, 1);

    expect(tx.cestaProduto.deleteMany).toHaveBeenCalledWith({
      where: { usuarioId: 1 },
    });
  });

  it('deletes all products by product id', async () => {
    const tx = prismaMock;

    (prismaClient.cestaProduto.deleteMany as jest.Mock).mockResolvedValue(undefined);

    await cestaRepository.deleteAllByProdutoId(tx, 1);

    expect(tx.cestaProduto.deleteMany).toHaveBeenCalledWith({
      where: { produtoId: 1 },
    });
  });
});
