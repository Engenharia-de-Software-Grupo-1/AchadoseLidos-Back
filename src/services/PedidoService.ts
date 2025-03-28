import { PedidoCreateDTO } from '@src/models/PedidoSchema';
import { pedidoRepository } from '@src/repositories/PedidoRepository';
import { AppError } from '@src/errors/AppError';

export class PedidoService {
  async create(data: PedidoCreateDTO) {
    if (data.produtos.length === 0) {
      throw new AppError('Pedido deve conter pelo menos um produto', 400);
    }
    const pedido = await pedidoRepository.create(data);
    const whatsappLink = this.gerarLinkWhatsapp(pedido);
    return { ...pedido, whatsappLink };
  }

  async getAll() {
    return await pedidoRepository.getAll();
  }

  async getById(id: number) {
    const pedido = await pedidoRepository.getById(id);
    if (!pedido) {
      throw new AppError('Pedido não encontrado', 404);
    }
    return pedido;
  }

  async cancelarPedido(id: number) {
    const pedido = await pedidoRepository.getById(id);
    if (!pedido) {
      throw new AppError('Pedido não encontrado', 404);
    }
    if (pedido.status === 'CANCELADO') {
      throw new AppError('Pedido já está cancelado', 400);
    }
    return await pedidoRepository.updateStatus(id, 'CANCELADO');
  }

  private gerarLinkWhatsapp(pedido: any) {
    const seboNome = pedido.sebo.nome;
    const numeroSebo = pedido.sebo.telefone;

    let mensagem = `Achados e Lidos - Confirmação de Pedido\n\n`;
    mensagem += `Olá, ${seboNome}! Acabei de realizar um novo pedido pelo site.\n\n`;
    mensagem += `Produto(s) do Pedido:\n`;
    pedido.produtos.forEach((p: any) => {
      mensagem += `- Nome: ${p.produto.nome}, Categoria: ${p.produto.categoria}, Quantidade: ${p.quantidade}, Preço: ${p.produto.preco}\n`;
    });
    mensagem += `\nTotal: ${pedido.total}\n\n`;
    mensagem += `Gostaria de saber mais detalhes sobre as formas de pagamento e entrega do pedido.`;

    const encodedMensagem = encodeURIComponent(mensagem);
    return `https://wa.me/${numeroSebo}?text=${encodedMensagem}`;
  }
}

export const pedidoService = new PedidoService();
