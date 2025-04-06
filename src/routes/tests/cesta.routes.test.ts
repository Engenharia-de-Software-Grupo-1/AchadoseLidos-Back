import { CategoriaProduto, EstadoConservacaoProduto, StatusProduto } from '@prisma/client';
import {
  CestaCreateDTO,
  CestaCreateSchema,
  CestaResponseSchema,
  CestaUpdateDTO,
  CestaUpdateSchema,
} from '@src/models/CestaSchema';
import { cestaRepository } from '@src/repositories/CestaRepository';
import { getAuthTokenId } from '@src/utils/authUtils';
import { produtoService } from '@src/services/ProdutoService';
import { cestaService } from '@src/services/CestaService';

jest.mock('@src/repositories/CestaRepository');
jest.mock('@src/utils/groupBySebo');
jest.mock('@src/utils/authUtils');
jest.mock('@src/models/CestaSchema');
jest.mock('@src/services/ProdutoService');

describe('CestaService', () => {
  it("adds a product to a user's basket", async () => {
    const data: CestaCreateDTO = {
      produtoId: 1,
    };

    (getAuthTokenId as jest.Mock).mockReturnValue(12);
    (CestaCreateSchema.parse as jest.Mock).mockReturnValue(data);
    (cestaRepository.getProduto as jest.Mock).mockResolvedValue(null);
    (produtoService.validarProduto as jest.Mock).mockResolvedValue(undefined);
    (cestaRepository.addProduto as jest.Mock).mockResolvedValue({
      produtoId: 1,
      quantidade: 2,
      usuarioId: 12,
    });
    (CestaResponseSchema.parseAsync as jest.Mock).mockResolvedValue({ produtoId: 1, quantidade: 2 });

    const result = await cestaService.adicionarProduto(data, 'testToken');

    expect(getAuthTokenId).toHaveBeenCalledWith('testToken');
    expect(CestaCreateSchema.parse).toHaveBeenCalledWith(data);
    expect(cestaRepository.getProduto).toHaveBeenCalledWith(12, 1);
    expect(produtoService.validarProduto).toHaveBeenCalledWith(1);
    expect(produtoService.validarQtdEstoque).toHaveBeenCalledWith(1);
    expect(cestaRepository.addProduto).toHaveBeenCalledWith(12, 1);
    expect(CestaResponseSchema.parseAsync).toHaveBeenCalledWith({ produtoId: 1, quantidade: 2, usuarioId: 12 });
    expect(result).toEqual({ produtoId: 1, quantidade: 2 });
  });

  it('should throw an error when trying to add a product to a basket twice', async () => {
    const data: CestaCreateDTO = {
      produtoId: 1,
    };

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

    (getAuthTokenId as jest.Mock).mockReturnValue(12);
    (CestaCreateSchema.parse as jest.Mock).mockReturnValue(data);
    (cestaRepository.getProduto as jest.Mock).mockResolvedValue(produto);

    await expect(cestaService.adicionarProduto(data, 'testToken')).rejects.toEqual({
      message: 'Produto já adicionado à cesta',
      statusCode: 409,
    });
  });

  it('updates a product in a basket', async () => {
    const data: CestaUpdateDTO = {
      quantidade: 3,
    };

    (getAuthTokenId as jest.Mock).mockReturnValue(12);
    (CestaUpdateSchema.parse as jest.Mock).mockReturnValue(data);
    (produtoService.validarQtdEstoque as jest.Mock).mockResolvedValue(undefined);
    (cestaRepository.updateProduto as jest.Mock).mockResolvedValue({
      produtoId: 1,
      quantidade: 3,
      usuarioId: 12,
    });
    (CestaResponseSchema.parseAsync as jest.Mock).mockResolvedValue({ produtoId: 1, quantidade: 3 });

    const result = await cestaService.atualizarProduto(1, data, 'testToken');

    expect(getAuthTokenId).toHaveBeenCalledWith('testToken');
    expect(CestaUpdateSchema.parse).toHaveBeenCalledWith(data);
    expect(produtoService.validarQtdEstoque).toHaveBeenCalledWith(1, 3);
    expect(cestaRepository.updateProduto).toHaveBeenCalledWith(12, 1, data);
    expect(CestaResponseSchema.parseAsync).toHaveBeenCalledWith({ produtoId: 1, quantidade: 3, usuarioId: 12 });
    expect(result).toEqual({ produtoId: 1, quantidade: 3 });
  });

  it("removes a product from a user's basket", async () => {
    (getAuthTokenId as jest.Mock).mockReturnValue(12);
    (cestaRepository.deleteProduto as jest.Mock).mockResolvedValue(undefined);

    await cestaService.removerProduto(1, 'testToken');

    expect(getAuthTokenId).toHaveBeenCalledWith('testToken');
    expect(cestaRepository.deleteProduto).toHaveBeenCalledWith(12, 1);
  });

  it('should throw an error if the product is not in the basket', async () => {
    (cestaRepository.getProduto as jest.Mock).mockResolvedValue(null);

    await expect(cestaService['validarProdutoCesta'](12, 1)).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });
});
