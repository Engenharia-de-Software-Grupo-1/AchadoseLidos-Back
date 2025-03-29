import { StatusPedido, TipoConta } from '@prisma/client';
import {
  PedidoCreateDTO,
  PedidoCreateSchema,
  PedidoResponseSchema,
  PedidoUpdateDTO,
  PedidoUpdateSchema,
} from '@src/models/PedidoSchema';
import { pedidoRepository } from '@src/repositories/PedidoRepository';
import { ensureSelfTargetedAction, getAuthTokenId, getAuthTokenIdAndRole } from '@src/utils/authUtils';
import { gerarLinkWhatsApp } from '@src/utils/whatsAppUtils';
import { Filter } from '@src/utils/filterUtils';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import { AppError } from '@src/errors/AppError';

import { produtoService } from './ProdutoService';
import { cestaService } from './CestaService';

class PedidoService {
  async create(data: PedidoCreateDTO, authToken: unknown) {
    const authTokenId = getAuthTokenId(authToken);
    const parsedData = PedidoCreateSchema.parse(data);

    await Promise.all(
      parsedData.produtos.map(async item => {
        await produtoService.validarProduto(item.produto.id);
        await produtoService.validarQtdEstoque(item.produto.id, item.quantidade);
      }),
    );

    const result = await pedidoRepository.create(parsedData, authTokenId);
    const whatsAppLink = gerarLinkWhatsApp(PedidoResponseSchema.parse(result));

    await Promise.all(parsedData.produtos.map(item => cestaService.removerProduto(item.produto.id, authToken)));
    return { whatsAppLink };
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

    if (pedido.status !== StatusPedido.PENDENTE) {
      throw new AppError('Pedido já concluído');
    }

    await Promise.all(parsedData.produtos.map(item => produtoService.validarProduto(item.produto.id)));

    const result = await pedidoRepository.update(id, parsedData);
    return PedidoResponseSchema.parseAsync(result);
  }
}

export default new PedidoService();
