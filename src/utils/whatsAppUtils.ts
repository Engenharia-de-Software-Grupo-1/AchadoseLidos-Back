import { PedidoResponseDTO } from '@src/models/PedidoSchema';

export function gerarLinkWhatsApp(pedido: PedidoResponseDTO) {
  const { nome, telefone } = pedido.sebo;

  const produtosPedido = pedido.produtos
    .map(p => {
      return `- Nome: *${p.produto.nome}*
- Categoria: *${p.produto.categoria}*
- Quantidade: *${p.quantidade}*
- Preço: *R$ ${p.produto.preco.toFixed(2)}*`;
    })
    .join('\n\n');

  const mensagem = [
    'Achados e Lidos - Confirmação de Pedido',
    '',
    `Olá, ${nome}! Acabei de realizar um novo pedido pelo site.`,
    '',
    '*Produto(s) do Pedido:*',
    produtosPedido,
    '',
    `*Total: R$ ${pedido.total.toFixed(2)}*`,
    '',
    'Gostaria de saber mais detalhes sobre as formas de pagamento e entrega do pedido.',
  ].join('\n');

  return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
}
