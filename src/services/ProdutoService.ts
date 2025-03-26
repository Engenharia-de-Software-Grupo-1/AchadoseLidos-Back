import {
  ProdutoCreateDTO,
  ProdutoCreateSchema,
  ProdutoResponseSchema,
  ProdutoUpdateDTO,
  ProdutoUpdateSchema,
} from '@src/models/ProdutoSchema';
import { produtoRepository } from '@src/repositories/ProdutoRepository';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import { ensureSelfTargetedAction, getAuthTokenId } from '@src/utils/authUtils';
import { AppError } from '@src/errors/AppError';
import { StatusProduto } from '@prisma/client';
import { Filter, Sorter } from '@src/utils/filterUtils';

class ProdutoService {
  async create(data: ProdutoCreateDTO, authToken: unknown) {
    const authTokenId = getAuthTokenId(authToken);
    const parsedData = ProdutoCreateSchema.parse(data);

    const result = await produtoRepository.create(parsedData, authTokenId);
    return ProdutoResponseSchema.parseAsync(result);
  }

  async getAll(data: { filters: Filter[]; sorters: Sorter[] }) {
    const result = await produtoRepository.getAll(data);
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

    await produtoRepository.delete(id);
  }

  async validarProduto(id: number) {
    const produto = await produtoRepository.getById(id);
    if (!produto || produto.status === StatusProduto.EXCLUIDO) {
      throw new EntityNotFoundError(id);
    }
  }

  async validarQtdEstoque(id: number, quantidade = 1) {
    const produto = await produtoRepository.getById(id);
    if (produto && produto.qtdEstoque < quantidade) {
      throw new AppError('Produto sem estoque suficiente', 409);
    }
  }
}

export const produtoService = new ProdutoService();
