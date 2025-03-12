import prismaClient from '@src/lib/prismaClient';
import { StatusConta, TipoConta } from '@prisma/client';
import { UsuarioCreateDTO, UsuarioUpdateDTO } from '@src/models/UsuarioSchema';

import { contaRepository } from './ContaRepository';

class UsuarioRepository {
  async create(data: UsuarioCreateDTO) {
    const { conta, ...usuario } = data;

    return prismaClient.$transaction(async tx => {
      const contaCriada = await contaRepository.create(tx, conta, TipoConta.USUARIO);
      const usuarioCriado = await tx.usuario.create({
        data: { ...usuario, conta: { connect: { id: contaCriada.id } } },
      });

      return { ...usuarioCriado, conta: contaCriada };
    });
  }

  async getAll() {
    return prismaClient.usuario.findMany({
      where: {
        conta: {
          status: StatusConta.ATIVA,
        },
      },
      include: { conta: true },
    });
  }

  async getById(id: number) {
    return prismaClient.usuario.findUnique({
      where: { id },
      include: { conta: true },
    });
  }

  async update(id: number, data: UsuarioUpdateDTO) {
    const { conta, ...usuario } = data;

    return prismaClient.$transaction(async tx => {
      await tx.usuario.update({ where: { id }, data: usuario });
      
      return tx.usuario.findUnique({
        where: { id },
        include: { conta: true },
      });
    });
  }
}

export const usuarioRepository = new UsuarioRepository();
