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
import { TokenInvalidError } from '@src/errors/TokenInvalidError';
import { ensureSelfTargetedAction } from '@src/utils/ensureSelfTargetedAction';

class ProdutoService {
  async create(data: ProdutoCreateDTO, authenticatedSeboToken: unknown) {
    if (!authenticatedSeboToken || typeof authenticatedSeboToken !== 'object' || !('id' in authenticatedSeboToken)) {
      throw new TokenInvalidError();
    }

    const parsedData = ProdutoCreateSchema.parse(data);
    const result = await produtoRepository.create(parsedData, authenticatedSeboToken.id as number);
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

  async update(id: number, data: ProdutoUpdateDTO, authenticatedSeboToken: unknown) {
    const parsedData = ProdutoUpdateSchema.parse(data);
    const produto = await this.getById(id);
    ensureSelfTargetedAction(produto.sebo.id, authenticatedSeboToken);

    const result = await produtoRepository.update(id, parsedData);
    return ProdutoResponseSchema.parseAsync(result);
  }

  async delete(id: number, authenticatedSeboToken: unknown) {
    const produto = await this.getById(id);
    ensureSelfTargetedAction(produto.sebo.id, authenticatedSeboToken);

    await produtoRepository.atualizarStatus(id, StatusProduto.EXCLUIDO);
  }
}

export const produtoService = new ProdutoService();
