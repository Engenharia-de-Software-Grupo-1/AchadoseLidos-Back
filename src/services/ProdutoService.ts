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

class ProdutoService {
  async create(data: ProdutoCreateDTO) {
    const parsedData = ProdutoCreateSchema.parse(data);
    const result = await produtoRepository.create(parsedData);
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

  async update(id: number, data: ProdutoUpdateDTO) {
    const parsedData = ProdutoUpdateSchema.parse(data);
    await this.getById(id);

    const result = await produtoRepository.update(id, parsedData);
    return ProdutoResponseSchema.parseAsync(result);
  }

  async delete(id: number) {
    const produto = await produtoRepository.getById(id);
    if (!produto) {
      throw new EntityNotFoundError(id);
    }
    await produtoRepository.atualizarStatus(id, StatusProduto.EXCLUIDO);
  }
}

export const produtoService = new ProdutoService();
