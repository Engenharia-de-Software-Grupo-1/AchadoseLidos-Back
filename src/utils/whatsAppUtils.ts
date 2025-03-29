import { PedidoResponseDTO } from '@src/models/PedidoSchema';

export function gerarLinkWhatsApp(pedido: PedidoResponseDTO) {
  const { nome, telefone } = pedido.sebo;

  const produtosPedido = pedido.produtos
    .map(
      p =>
        `- Nome: ${p.produto.nome}, Categoria: ${p.produto.categoria}, Quantidade: ${p.quantidade}, Preço: ${p.produto.preco}`,
    )
    .join('\n');

  const mensagem = [
    'Achados e Lidos - Confirmação de Pedido',
    `Olá, ${nome}! Acabei de realizar um novo pedido pelo site.`,
    '',
    'Produto(s) do Pedido:',
    produtosPedido,
    `\nTotal: ${pedido.total}\n`,
    'Gostaria de saber mais detalhes sobre as formas de pagamento e entrega do pedido.',
  ].join('\n');

  return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
}
