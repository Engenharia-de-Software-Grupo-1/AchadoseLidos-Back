import prismaClient from '@src/lib/prismaClient';
import { ProdutoCreateDTO, ProdutoUpdateDTO } from '@src/models/ProdutoSchema';
import { CategoriaProduto, EstadoConservacaoProduto, StatusProduto } from '@prisma/client';
import { DELETED_PRODUTO } from '@src/constants/deletedData';

import { produtoRepository } from '../ProdutoRepository';

jest.mock('@src/lib/prismaClient');

describe('ProdutoRepository', () => {
  it('creates a new product', async () => {
    const data: ProdutoCreateDTO = {
      nome: 'Produto 1',
      preco: 10,
      categoria: CategoriaProduto.LIVRO,
      qtdEstoque: 10,
      estadoConservacao: EstadoConservacaoProduto.NOVO,
      anoEdicao: 2020,
      anoLancamento: 2021,
      generos: [''],
    };

    const produtoCriado = {
      id: 1,
      ...data,
    };

    const mockTx = {
      produto: {
        create: jest.fn().mockResolvedValue(produtoCriado),
        findUnique: jest.fn().mockResolvedValue(produtoCriado),
      },
    };

    (prismaClient.$transaction as jest.Mock).mockImplementation(async fn => fn(mockTx));

    const result = await produtoRepository.create(data, 123);

    expect(prismaClient.$transaction).toHaveBeenCalled();
    expect(mockTx.produto.create).toHaveBeenCalledWith({
      data: { ...data, sebo: { connect: { id: 123 } } },
    });
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
        estadoConservacao: EstadoConservacaoProduto.NOVO,
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
        estadoConservacao: EstadoConservacaoProduto.NOVO,
        anoEdicao: 2020,
        anoLancamento: 2021,
      },
    ];

    (prismaClient.produto.findMany as jest.Mock).mockResolvedValue(produtos);

    const result = await produtoRepository.getAll({
      filters: [],
      sorters: [],
    });

    expect(result).toEqual(produtos);
    expect(prismaClient.produto.findMany).toHaveBeenCalledWith({
      where: { status: StatusProduto.ATIVO },
      include: {
        fotos: true,
        sebo: { include: { endereco: true } },
      },
    });
  });

  it('returns all filtered products', async () => {
    const produtos = [
      {
        id: 1,
        seboId: 123,
        status: StatusProduto.ATIVO,
        nome: 'Produto 1',
        preco: 10,
        categoria: CategoriaProduto.LIVRO,
        qtdEstoque: 10,
        estadoConservacao: EstadoConservacaoProduto.NOVO,
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
        estadoConservacao: EstadoConservacaoProduto.NOVO,
        anoEdicao: 2020,
        anoLancamento: 2021,
      },
    ];

    (prismaClient.produto.findMany as jest.Mock).mockResolvedValue(produtos);

    const result = await produtoRepository.getAll({
      filters: [
        {
          campo: 'preco',
          operador: '<=',
          valor: '15',
        },
      ],
      sorters: [],
    });

    expect(result).toEqual(produtos);
    expect(prismaClient.produto.findMany).toHaveBeenCalledWith({
      where: {
        status: StatusProduto.ATIVO,
        preco: { lte: '15' },
      },
      include: {
        fotos: true,
        sebo: { include: { endereco: true } },
      },
    });
  });

  it('returns all products sorted', async () => {
    const produtos = [
      {
        id: 1,
        seboId: 123,
        status: StatusProduto.ATIVO,
        nome: 'Produto 1',
        preco: 10,
        categoria: CategoriaProduto.LIVRO,
        qtdEstoque: 10,
        estadoConservacao: EstadoConservacaoProduto.NOVO,
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
        estadoConservacao: EstadoConservacaoProduto.NOVO,
        anoEdicao: 2020,
        anoLancamento: 2021,
      },
    ];

    (prismaClient.produto.findMany as jest.Mock).mockResolvedValue(produtos);

    const result = await produtoRepository.getAll({
      filters: [
        {
          campo: 'preco',
          operador: '<=',
          valor: '15',
        },
      ],
      sorters: [
        {
          campo: 'nome',
          ordem: 'DESC',
        },
      ],
    });

    expect(result).toEqual(produtos);
    expect(prismaClient.produto.findMany).toHaveBeenCalledWith({
      where: {
        status: StatusProduto.ATIVO,
        preco: { lte: '15' },
      },
      include: {
        fotos: true,
        sebo: { include: { endereco: true } },
      },
      orderBy: [{ nome: 'desc' }],
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
      estadoConservacao: EstadoConservacaoProduto.NOVO,
      anoEdicao: 2020,
      anoLancamento: 2021,
    };

    (prismaClient.produto.findUnique as jest.Mock).mockResolvedValue(produto);

    const result = await produtoRepository.getById(1);

    expect(result).toEqual(produto);
    expect(prismaClient.produto.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        fotos: true,
        sebo: { include: { endereco: true } },
      },
    });
  });

  it('updates a product by id', async () => {
    const produto: ProdutoUpdateDTO = {
      nome: 'Produto 1',
      preco: 10,
      categoria: CategoriaProduto.LIVRO,
      qtdEstoque: 10,
      estadoConservacao: EstadoConservacaoProduto.NOVO,
      anoEdicao: 2020,
      anoLancamento: 2021,
      generos: [''],
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

  it('deletes a product by id', async () => {
    (prismaClient.fotoProduto.deleteMany as jest.Mock).mockResolvedValue({ count: 2 });
    (prismaClient.produto.update as jest.Mock).mockResolvedValue(DELETED_PRODUTO);

    await produtoRepository.delete(1);

    expect(prismaClient.fotoProduto.deleteMany).toHaveBeenCalledWith({
      where: { produtoId: 1 },
    });
    expect(prismaClient.produto.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: DELETED_PRODUTO,
    });
  });
});
