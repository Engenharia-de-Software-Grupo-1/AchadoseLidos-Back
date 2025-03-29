import { produtoRepository } from '@src/repositories/ProdutoRepository';
import { ProdutoCreateDTO, ProdutoUpdateDTO, ProdutoUpdateSchema } from '@src/models/ProdutoSchema';
import { ProdutoCreateSchema, ProdutoResponseSchema } from '@src/models/ProdutoSchema';
import { StatusProduto, CategoriaProduto, EstadoConservacaoProduto } from '@prisma/client';
import { ensureSelfTargetedAction, getAuthTokenId } from '@src/utils/authUtils';

import { produtoService } from '../ProdutoService';

jest.mock('@src/repositories/ProdutoRepository');
jest.mock('@src/models/ProdutoSchema');
jest.mock('@src/utils/authUtils');

describe('ProdutoService', () => {
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

    (getAuthTokenId as jest.Mock).mockReturnValue(123);
    (ProdutoCreateSchema.parse as jest.Mock).mockReturnValue(data);
    (produtoRepository.create as jest.Mock).mockResolvedValue(produtoCriado);
    (ProdutoResponseSchema.parseAsync as jest.Mock).mockResolvedValue(produtoCriado);

    const result = await produtoService.create(data, 123);

    expect(getAuthTokenId).toHaveBeenCalledWith(123);
    expect(ProdutoCreateSchema.parse).toHaveBeenCalledWith(data);
    expect(produtoRepository.create).toHaveBeenCalledWith(data, 123);
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

    (produtoRepository.getAll as jest.Mock).mockResolvedValue(produtos);
    (ProdutoResponseSchema.array as jest.Mock).mockReturnValue({
      parseAsync: jest.fn().mockResolvedValue(produtos),
    });

    const result = await produtoService.getAll({
      filters: [],
      sorters: [],
    });

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
      estadoConservacao: EstadoConservacaoProduto.NOVO,
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
      nome: 'Produto 1',
      preco: 10,
      categoria: CategoriaProduto.LIVRO,
      qtdEstoque: 10,
      estadoConservacao: EstadoConservacaoProduto.NOVO,
      anoEdicao: 2020,
      anoLancamento: 2021,
      generos: [''],
    };

    const produtoResponse = {
      id: 1,
      nome: 'Produto 1',
      preco: 10,
      categoria: CategoriaProduto.LIVRO,
      qtdEstoque: 10,
      estadoConservacao: EstadoConservacaoProduto.NOVO,
      anoEdicao: 2020,
      anoLancamento: 2021,
      generos: [''],
      createdAt: '2024',
      updatedAt: '2025',
      sebo: { id: 123 },
    };

    (ProdutoUpdateSchema.parse as jest.Mock).mockReturnValue(produto);
    (produtoRepository.getById as jest.Mock).mockResolvedValue(produtoResponse);
    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {});
    (produtoRepository.update as jest.Mock).mockResolvedValue(produtoResponse);
    (ProdutoResponseSchema.parseAsync as jest.Mock).mockResolvedValue(produtoResponse);

    const result = await produtoService.update(1, produto, 'testToken');

    expect(ProdutoUpdateSchema.parse).toHaveBeenCalledWith(produto);
    expect(produtoRepository.getById).toHaveBeenCalledWith(1);
    expect(ensureSelfTargetedAction).toHaveBeenCalledWith(123, 'testToken');
    expect(produtoRepository.update).toHaveBeenCalledWith(1, produto);
    expect(ProdutoResponseSchema.parseAsync).toHaveBeenCalledWith(produtoResponse);
    expect(result).toEqual(produtoResponse);
  });

  it('should throw an error when update is called and product does not exist', async () => {
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

    (ProdutoUpdateSchema.parse as jest.Mock).mockReturnValue(undefined);
    (produtoRepository.getById as jest.Mock).mockResolvedValue(undefined);

    await expect(produtoService.update(1, produto, 'testToken')).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });

  it('deletes a product by id', async () => {
    const produtoResponse = {
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
      createdAt: '2024',
      updatedAt: '2025',
      sebo: { id: 123 },
    };

    (produtoRepository.getById as jest.Mock).mockResolvedValueOnce(produtoResponse);
    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {});
    (produtoRepository.delete as jest.Mock).mockResolvedValueOnce(produtoResponse);

    await produtoService.delete(1, 'testToken');

    expect(produtoRepository.getById).toHaveBeenCalledWith(1);
    expect(ensureSelfTargetedAction).toHaveBeenCalledWith(123, 'testToken');
    expect(produtoRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw an error when delete is called and product does not exist', async () => {
    (produtoRepository.getById as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(produtoService.delete(1, 'testToken')).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });
});
