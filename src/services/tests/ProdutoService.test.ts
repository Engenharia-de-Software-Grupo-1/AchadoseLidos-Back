import { produtoRepository } from '@src/repositories/ProdutoRepository';
import { ProdutoCreateDTO, ProdutoUpdateDTO, ProdutoUpdateSchema } from '@src/models/ProdutoSchema';
import { ProdutoCreateSchema, ProdutoResponseSchema } from '@src/models/ProdutoSchema';
import { StatusProduto, CategoriaProduto, EstadoConservacaoProduto } from '@prisma/client';
import { parse } from 'path';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';

import { produtoService } from '../ProdutoService';

jest.mock('@src/repositories/ProdutoRepository');
jest.mock('@src/models/ProdutoSchema');

describe('ProdutoService', () => {
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

    (ProdutoCreateSchema.parse as jest.Mock).mockReturnValue(data);
    (produtoRepository.create as jest.Mock).mockResolvedValue(produtoCriado);
    (ProdutoResponseSchema.parseAsync as jest.Mock).mockResolvedValue(produtoCriado);

    const result = await produtoService.create(data);

    expect(ProdutoCreateSchema.parse).toHaveBeenCalledWith(data);
    expect(produtoRepository.create).toHaveBeenCalledWith(data);
    expect(ProdutoResponseSchema.parseAsync).toHaveBeenCalledWith(produtoCriado);
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

    (produtoRepository.getAll as jest.Mock).mockResolvedValue(produtos);
    (ProdutoResponseSchema.array as jest.Mock).mockReturnValue({
      parseAsync: jest.fn().mockResolvedValue(produtos),
    });

    const result = await produtoService.getAll();

    expect(produtoRepository.getAll).toHaveBeenCalled();
    expect(ProdutoResponseSchema.array().parseAsync).toHaveBeenCalledWith(produtos);
    expect(result).toEqual(produtos);
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

    (produtoRepository.getById as jest.Mock).mockResolvedValue(produto);
    (ProdutoResponseSchema.parseAsync as jest.Mock).mockResolvedValue(produto);

    const result = await produtoService.getById(1);

    expect(produtoRepository.getById).toHaveBeenCalledWith(1);
    expect(ProdutoResponseSchema.parseAsync).toHaveBeenCalledWith(produto);
    expect(result).toEqual(produto);
  });

  it('should throw an error when getById is called and product does not exist', async () => {
    (produtoRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(produtoService.getById(1)).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
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

    (ProdutoUpdateSchema.parse as jest.Mock).mockReturnValue(produto);
    (produtoRepository.getById as jest.Mock).mockResolvedValue(produto);
    (produtoRepository.update as jest.Mock).mockResolvedValue(produto);
    (ProdutoResponseSchema.parseAsync as jest.Mock).mockResolvedValue(produto);

    const result = await produtoService.update(1, produto);

    expect(ProdutoUpdateSchema.parse).toHaveBeenCalledWith(produto);
    expect(produtoRepository.getById).toHaveBeenCalledWith(1);
    expect(produtoRepository.update).toHaveBeenCalledWith(1, produto);
    expect(ProdutoResponseSchema.parseAsync).toHaveBeenCalledWith(produto);
    expect(result).toEqual(produto);
  });

  it('should throw an error when update is called and product does not exist', async () => {
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

    (ProdutoUpdateSchema.parse as jest.Mock).mockReturnValue(undefined);
    (produtoRepository.getById as jest.Mock).mockResolvedValue(undefined);

    await expect(produtoService.update(1, produto)).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });

  it('deletes a product by id', async () => {
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

    (produtoRepository.getById as jest.Mock).mockResolvedValueOnce(produto);
    (produtoRepository.atualizarStatus as jest.Mock).mockResolvedValue(undefined);

    await produtoService.delete(1);

    expect(produtoRepository.getById).toHaveBeenCalledWith(1);
    expect(produtoRepository.atualizarStatus).toHaveBeenCalledWith(1, StatusProduto.EXCLUIDO);
  });

  it('should throw an error when delete is called and product does not exist', async () => {
    (produtoRepository.getById as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(produtoService.delete(1)).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });
});
