import {
  ProdutoCreateDTO,
  ProdutoCreateSchema,
  ProdutoResponseSchema,
  ProdutoUpdateDTO,
  ProdutoUpdateSchema,
} from '@src/models/ProdutoSchema';
import { produtoRepository } from '@src/repositories/ProdutoRepository';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import { StatusProduto } from '@prisma/client';
import { ensureSelfTargetedAction, getAuthTokenId } from '@src/utils/authUtils';

class ProdutoService {
  async create(data: ProdutoCreateDTO, authToken: unknown) {
    const authTokenId = getAuthTokenId(authToken);
    const parsedData = ProdutoCreateSchema.parse(data);

    const result = await produtoRepository.create(parsedData, authTokenId);
    return ProdutoResponseSchema.parseAsync(result);
  }

  async getAll() {
    const result = await produtoRepository.getAll();
    return await ProdutoResponseSchema.array().parseAsync(result);
  }

  async getById(id: number) {
    const result = await produtoRepository.getById(id);
    if (!result) {
      throw new EntityNotFoundError(id);
    }
    return ProdutoResponseSchema.parseAsync(result);
  }

  async update(id: number, data: ProdutoUpdateDTO, authToken: unknown) {
    const parsedData = ProdutoUpdateSchema.parse(data);
    const produto = await this.getById(id);
    ensureSelfTargetedAction(produto.sebo.id, authToken);

    const result = await produtoRepository.update(id, parsedData);
    return ProdutoResponseSchema.parseAsync(result);
  }

  async delete(id: number, authToken: unknown) {
    const produto = await this.getById(id);
    ensureSelfTargetedAction(produto.sebo.id, authToken);

    await produtoRepository.atualizarStatus(id, StatusProduto.EXCLUIDO);
  }
}

export const produtoService = new ProdutoService();
