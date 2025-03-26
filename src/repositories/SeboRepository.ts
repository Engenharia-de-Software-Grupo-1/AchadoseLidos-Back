import prismaClient from '@src/lib/prismaClient';
import { StatusConta, TipoConta } from '@prisma/client';
import { SeboCreateDTO, SeboUpdateDTO } from '@src/models/SeboSchema';
import { DELETED_ENDERECO, DELETED_SEBO } from '@src/constants/deletedData';
import { Filter, Sorter, buildWhereClause, buildOrderClause } from '@src/utils/filterUtils';

import { contaRepository } from './ContaRepository';
import { produtoRepository } from './ProdutoRepository';

class SeboRepository {
  async create(data: SeboCreateDTO) {
    const { conta, endereco, ...sebo } = data;

    return prismaClient.$transaction(async tx => {
      const contaCriada = await contaRepository.create(tx, conta, TipoConta.SEBO);
      const seboCriado = await tx.sebo.create({
        data: { ...sebo, conta: { connect: { id: contaCriada.id } } },
      });
      const enderecoCriado = await tx.enderecoSebo.create({
        data: { ...endereco, sebo: { connect: { id: seboCriado.id } } },
      });

      return { ...seboCriado, conta: contaCriada, endereco: enderecoCriado };
    });
  }

  async getAll(data: { filters: Filter[]; sorters: Sorter[] }) {
    return prismaClient.sebo.findMany({
      where: {
        conta: {
          status: StatusConta.ATIVA,
        },
        ...buildWhereClause(data.filters),
      },
      include: { endereco: true },
      orderBy: buildOrderClause(data.sorters),
    });
  }

  async getById(id: number) {
    return prismaClient.sebo.findUnique({
      where: { id },
      include: { conta: true, endereco: true, fotos: true, produtos: true },
    });
  }

  async update(id: number, data: SeboUpdateDTO) {
    const { endereco, fotos, ...sebo } = data;

    return prismaClient.$transaction(async tx => {
      await Promise.all([
        tx.sebo.update({ where: { id }, data: sebo }),
        tx.enderecoSebo.update({ where: { seboId: id }, data: endereco }),
        tx.fotoSebo.deleteMany({ where: { seboId: id } }),
      ]);

      if (fotos?.length) {
        await tx.fotoSebo.createMany({
          data: fotos.map(foto => ({ url: foto.url, seboId: id })),
        });
      }

      return tx.sebo.findUnique({
        where: { id },
        include: { conta: true, endereco: true, fotos: true },
      });
    });
  }

  async delete(id: number) {
    const sebo = await this.getById(id);
    if (!sebo) return;

    await prismaClient.$transaction(async tx => {
      await Promise.all([
        contaRepository.delete(tx, sebo.conta.id),
        tx.sebo.update({ where: { id }, data: DELETED_SEBO }),
        tx.enderecoSebo.update({ where: { seboId: id }, data: DELETED_ENDERECO }),
        tx.fotoSebo.deleteMany({ where: { seboId: id } }),
        sebo.produtos.forEach(produto => produtoRepository.delete(produto.id, tx)),
      ]);
    });
  }
}

export const seboRepository = new SeboRepository();
