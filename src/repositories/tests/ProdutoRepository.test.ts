import prismaClient from '@src/lib/prismaClient';
import { ProdutoCreateDTO, ProdutoUpdateDTO } from '@src/models/ProdutoSchema';
import { CategoriaProduto, EstadoConservacaoProduto, StatusProduto } from '@prisma/client';

import { produtoRepository } from '../ProdutoRepository';

jest.mock('@src/lib/prismaClient');

describe('ProdutoRepository', () => {
  it('creates a new product', async () => {
    const data: ProdutoCreateDTO = {
      seboId: 123,
      status: StatusProduto.ATIVO,
      nome: 'Produto 1',
      preco: 10,
      categoria: CategoriaProduto.LIVRO,
      qtdEstoque: 10,
      estadoConservacao: EstadoConservacaoProduto.BOM,
      anoEdicao: 2020,
      anoLancamento: 2021,
    };

    const produtoCriado = {
      id: 1,
      ...data,
    };

    (prismaClient.$transaction as jest.Mock).mockImplementation(async fn =>
      fn({
        produto: {
          create: jest.fn().mockResolvedValue(produtoCriado),
          findUnique: jest.fn().mockResolvedValue(produtoCriado),
        },
      }),
    );

    const result = await produtoRepository.create(data);

    expect(prismaClient.$transaction).toHaveBeenCalled();
    expect(result).toEqual(produtoCriado);
  });

  it('returns all products', async () => {
    const produtos = [
      {
        id: 1,
        seboId: 123,
        status: StatusProduto.ATIVO,
        nome: 'Produto 1',
        preco: 10,
        categoria: CategoriaProduto.LIVRO,
        qtdEstoque: 10,
        estadoConservacao: EstadoConservacaoProduto.BOM,
        anoEdicao: 2020,
        anoLancamento: 2021,
      },
      {
        id: 2,
        seboId: 456,
        status: StatusProduto.ATIVO,
        nome: 'Produto 2',
        preco: 10,
        categoria: CategoriaProduto.LIVRO,
        qtdEstoque: 10,
        estadoConservacao: EstadoConservacaoProduto.BOM,
        anoEdicao: 2020,
        anoLancamento: 2021,
      },
    ];

    (prismaClient.produto.findMany as jest.Mock).mockResolvedValue(produtos);

    const result = await produtoRepository.getAll();

    expect(result).toEqual(produtos);
    expect(prismaClient.produto.findMany).toHaveBeenCalledWith({
      where: { status: StatusProduto.ATIVO },
      include: { fotos: true },
    });
  });

  it('returns a product by id', async () => {
    const produto = {
      id: 1,
      seboId: 123,
      status: StatusProduto.ATIVO,
      nome: 'Produto 1',
      preco: 10,
      categoria: CategoriaProduto.LIVRO,
      qtdEstoque: 10,
      estadoConservacao: EstadoConservacaoProduto.BOM,
      anoEdicao: 2020,
      anoLancamento: 2021,
    };

    (prismaClient.produto.findUnique as jest.Mock).mockResolvedValue(produto);

    const result = await produtoRepository.getById(1);

    expect(result).toEqual(produto);
    expect(prismaClient.produto.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { fotos: true },
    });
  });

  it('updates a product by id', async () => {
    const produto: ProdutoUpdateDTO = {
      id: 1,
      seboId: 123,
      status: StatusProduto.ATIVO,
      nome: 'Produto 1',
      preco: 10,
      categoria: CategoriaProduto.LIVRO,
      qtdEstoque: 10,
      estadoConservacao: EstadoConservacaoProduto.BOM,
      anoEdicao: 2020,
      anoLancamento: 2021,
      createdAt: '2024',
      updatedAt: '2025',
    };

    (prismaClient.$transaction as jest.Mock).mockImplementation(async fn =>
      fn({
        produto: {
          update: jest.fn(),
          findUnique: jest.fn().mockResolvedValue(produto),
        },
        fotoProduto: { deleteMany: jest.fn(), createMany: jest.fn() },
      }),
    );

    const result = await produtoRepository.update(1, produto);

    expect(result).toEqual(produto);
    expect(prismaClient.$transaction).toHaveBeenCalled();
  });

  it('updates a product status by id', async () => {
    const novoStatus = StatusProduto.EXCLUIDO;

    const produtoAtualizado = {
      id: 1,
      status: novoStatus,
    };

    (prismaClient.produto.update as jest.Mock).mockResolvedValue(produtoAtualizado);

    const result = await produtoRepository.atualizarStatus(1, novoStatus);

    expect(result).toEqual(produtoAtualizado);
    expect(prismaClient.produto.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: novoStatus },
    });
  });
});
