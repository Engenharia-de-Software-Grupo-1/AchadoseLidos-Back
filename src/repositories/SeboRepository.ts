import prismaClient from '@src/lib/prismaClient';
import { StatusConta, TipoConta } from '@prisma/client';
import { SeboCreateDTO, SeboUpdateDTO } from '@src/models/SeboSchema';

import { contaRepository } from './ContaRepository';

class SeboRepository {
  async create(data: SeboCreateDTO) {
    const { conta, endereco, fotos, ...sebo } = data;

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

  async getAll() {
    return prismaClient.sebo.findMany({
      where: {
        conta: {
          status: StatusConta.ATIVA,
        },
      },
      include: { endereco: true },
    });
  }

  async getById(id: number) {
    return prismaClient.sebo.findUnique({
      where: { id },
      include: { endereco: true, fotos: true },
    });
  }

  async update(id: number, data: SeboUpdateDTO) {
    const { conta, endereco, fotos, ...sebo } = data;

    return prismaClient.$transaction(async tx => {
      await Promise.all([
        tx.sebo.update({ where: { id }, data: sebo }),
        tx.enderecoSebo.update({ where: { seboId: id }, data: endereco }),
        tx.fotoSebo.deleteMany({ where: { seboId: id } }),
      ]);

      if (fotos && fotos.length > 0) {
        await tx.fotoSebo.createMany({
          data: fotos.map(foto => ({ url: foto.url, seboId: id })),
        });
      }

      return this.getById(id);
    });
  }
}

export const seboRepository = new SeboRepository();
