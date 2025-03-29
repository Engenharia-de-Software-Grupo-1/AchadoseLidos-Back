import { PrismaClient } from '@prisma/client';
import { PedidoCreateDTO, PedidoCreateSchema, StatusPedido } from '@src/models/PedidoSchema';

const prisma = new PrismaClient();

class PedidoService {
  async create(data: PedidoCreateDTO) {
    const validatedData = PedidoCreateSchema.parse(data);

    const pedido = await prisma.pedido.create({
      data: {
        seboId: validatedData.seboId,
        usuarioId: validatedData.usuarioId,
        status: validatedData.status,
        qtdProdutos: validatedData.qtdProdutos,
        total: validatedData.total,
        produtos: {
          create: validatedData.produtos.map(produto => ({
            produtoId: produto.produtoId,
            quantidade: produto.quantidade,
            status: produto.status,
          })),
        },
      },
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
        sebo: true,
        usuario: true,
      },
    });

    return pedido;
  }

  async getById(id: number) {
    return prisma.pedido.findUnique({
      where: { id },
      include: {
        produtos: { include: { produto: true } },
        sebo: true,
        usuario: true,
      },
    });
  }

  async getAll() {
    return prisma.pedido.findMany({
      include: {
        produtos: { include: { produto: true } },
        sebo: true,
        usuario: true,
      },
    });
  }

  async cancel(id: number) {
    const pedido = await prisma.pedido.findUnique({ where: { id } });

    if (!pedido) throw new Error('Pedido não encontrado');
    if (pedido.status === 'CANCELADO') throw new Error('Pedido já está cancelado');

    await prisma.pedido.update({
      where: { id },
      data: { status: StatusPedido.Enum.CANCELADO },
    });

    return prisma.pedido.findUnique({
      where: { id },
      include: {
        produtos: { include: { produto: true } },
        sebo: true,
        usuario: true,
      },
    });
  }
}

export default new PedidoService();
