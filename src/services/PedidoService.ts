import { TipoConta } from '@prisma/client';
import {
  PedidoCreateDTO,
  PedidoCreateSchema,
  PedidoResponseSchema,
  PedidoUpdateDTO,
  PedidoUpdateSchema,
} from '@src/models/PedidoSchema';
import { pedidoRepository } from '@src/repositories/PedidoRepository';
import { ensureSelfTargetedAction, getAuthTokenId, getAuthTokenIdAndRole } from '@src/utils/authUtils';
import { Filter } from '@src/utils/filterUtils';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';

import { produtoService } from './ProdutoService';

class PedidoService {
  async create(data: PedidoCreateDTO, authToken: unknown) {
    const authTokenId = getAuthTokenId(authToken);
    const parsedData = PedidoCreateSchema.parse(data);

    parsedData.produtos.forEach(async item => await produtoService.validarProduto(item.produto.id));
    parsedData.produtos.forEach(async item => await produtoService.validarQtdEstoque(item.produto.id, item.quantidade));

    const result = await pedidoRepository.create(parsedData, authTokenId);

    // quando criar o pedido, remover da cesta
    return PedidoResponseSchema.parseAsync(result);
  }

  async getAll(filters: Filter[], authToken: unknown) {
    const { authTokenId, role } = getAuthTokenIdAndRole(authToken);

    const result = await pedidoRepository.getAll(authTokenId, role, filters);
    return await PedidoResponseSchema.array().parseAsync(result);
  }

  async getById(id: number, authToken: unknown) {
    const { authTokenId: _, role } = getAuthTokenIdAndRole(authToken);

    const result = await pedidoRepository.getById(id);
    if (!result) {
      throw new EntityNotFoundError(id);
    }

    const pedidoId = role === TipoConta.SEBO ? result.sebo.id : result.usuario.id;
    ensureSelfTargetedAction(pedidoId, authToken);

    return PedidoResponseSchema.parseAsync(result);
  }

  async update(id: number, data: PedidoUpdateDTO, authToken: unknown) {
    const parsedData = PedidoUpdateSchema.parse(data);
    const pedido = await this.getById(id, authToken);

    ensureSelfTargetedAction(pedido.sebo.id, authToken);
    parsedData.produtos.forEach(async item => await produtoService.validarProduto(item.produto.id));
    // validar se o pedido/produto já foram atualizados, e se estão sendo atualizados para status válidos

    const result = await pedidoRepository.update(id, parsedData);
    return PedidoResponseSchema.parseAsync(result);
  }
}

export default new PedidoService();
