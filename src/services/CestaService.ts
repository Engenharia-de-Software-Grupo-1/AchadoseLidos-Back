import {
  CestaAgrupadaSchema,
  CestaCreateDTO,
  CestaCreateSchema,
  CestaResponseSchema,
  CestaUpdateDTO,
  CestaUpdateSchema,
} from '@src/models/CestaSchema';
import { cestaRepository } from '@src/repositories/CestaRepository';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import { getAuthTokenId } from '@src/utils/authUtils';
import { AppError } from '@src/errors/AppError';
import { groupBySebo } from '@src/utils/groupBySebo';

import { produtoService } from './ProdutoService';

class CestaService {
  async getCesta(authToken: unknown) {
    const usuarioId = getAuthTokenId(authToken);

    const produtos = await cestaRepository.getCesta(usuarioId);
    const produtosAgrupados = groupBySebo(produtos);
    return CestaAgrupadaSchema.array().parseAsync(produtosAgrupados);
  }

  async adicionarProduto(data: CestaCreateDTO, authToken: unknown) {
    const usuarioId = getAuthTokenId(authToken);
    const { produtoId } = CestaCreateSchema.parse(data);

    const produto = await cestaRepository.getProduto(usuarioId, produtoId);
    if (produto) {
      throw new AppError('Produto já adicionado à cesta', 409);
    }

    await produtoService.validarProduto(produtoId);
    await produtoService.validarQtdEstoque(produtoId);

    const result = await cestaRepository.addProduto(usuarioId, produtoId);
    return CestaResponseSchema.parseAsync(result);
  }

  async atualizarProduto(produtoId: number, data: CestaUpdateDTO, authToken: unknown) {
    const usuarioId = getAuthTokenId(authToken);
    const parsedData = CestaUpdateSchema.parse(data);

    await this.validarProdutoCesta(usuarioId, produtoId);
    await produtoService.validarQtdEstoque(produtoId, parsedData.quantidade);

    const result = await cestaRepository.updateProduto(usuarioId, produtoId, parsedData);
    return CestaResponseSchema.parseAsync(result);
  }

  async removerProduto(produtoId: number, authToken: unknown) {
    const usuarioId = getAuthTokenId(authToken);

    await this.validarProdutoCesta(usuarioId, produtoId);
    await cestaRepository.deleteProduto(usuarioId, produtoId);
  }

  private async validarProdutoCesta(usuarioId: number, produtoId: number) {
    const produto = await cestaRepository.getProduto(usuarioId, produtoId);
    if (!produto) {
      throw new EntityNotFoundError(produtoId);
    }
  }
}

export const cestaService = new CestaService();
