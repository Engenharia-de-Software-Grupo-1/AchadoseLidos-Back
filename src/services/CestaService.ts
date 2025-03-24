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

class CestaService {
  async getCesta(authToken: unknown) {
    const usuarioId = getAuthTokenId(authToken);

    const result = await cestaRepository.getCesta(usuarioId);
    return await CestaAgrupadaSchema.array().parseAsync(result);
  }

  async adicionarProduto(data: CestaCreateDTO, authToken: unknown) {
    const usuarioId = getAuthTokenId(authToken);
    const parsedData = CestaCreateSchema.parse(data);
    // validar produtoId
    // validar se há quantidade em estoque disponível

    const result = await cestaRepository.addProduto(usuarioId, parsedData.produtoId);
    return CestaResponseSchema.parseAsync(result);
  }

  async atualizarProduto(produtoId: number, data: CestaUpdateDTO, authToken: unknown) {
    const usuarioId = getAuthTokenId(authToken);
    this.validarProduto(usuarioId, produtoId);
    // validar se ainda há quantidade em estoque disponível

    const parsedData = CestaUpdateSchema.parse(data);
    const result = await cestaRepository.updateProduto(usuarioId, produtoId, parsedData);
    return CestaResponseSchema.parseAsync(result);
  }

  async removerProduto(produtoId: number, authToken: unknown) {
    const usuarioId = getAuthTokenId(authToken);
    await this.validarProduto(usuarioId, produtoId);

    await cestaRepository.deleteProduto(usuarioId, produtoId);
  }

  private async validarProduto(usuarioId: number, produtoId: number) {
    const produto = await cestaRepository.getProduto(usuarioId, produtoId);
    if (!produto) {
      throw new EntityNotFoundError(produtoId);
    }
  }
}

export const cestaService = new CestaService();
