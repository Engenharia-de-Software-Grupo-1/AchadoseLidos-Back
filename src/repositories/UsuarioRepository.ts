import prismaClient from '@src/lib/prismaClient';
import { StatusConta, TipoConta } from '@prisma/client';
import { UsuarioCreateDTO, UsuarioUpdateDTO } from '@src/models/UsuarioSchema';
import { DELETED_USUARIO } from '@src/constants/deletedData';

import { contaRepository } from './ContaRepository';

class UsuarioRepository {
  async create(data: UsuarioCreateDTO) {
    const { conta, ...usuario } = data;

    return prismaClient.$transaction(async tx => {
      const contaCriada = await contaRepository.create(tx, conta, TipoConta.USUARIO);
      const usuarioCriado = await tx.usuario.create({
        data: { ...usuario, conta: { connect: { id: contaCriada.id } } },
      });

      return usuarioCriado;
    });
  }

  async getAll() {
    return prismaClient.usuario.findMany({
      where: {
        conta: {
          status: StatusConta.ATIVA,
        },
      },
    });
  }

  async getById(id: number) {
    return prismaClient.usuario.findUnique({
      where: { id },
      include: { conta: true },
    });
  }

  async update(id: number, data: UsuarioUpdateDTO) {
    return prismaClient.usuario.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    const usuario = await this.getById(id);
    if (!usuario) return;

    await prismaClient.$transaction(async tx => {
      await Promise.all([
        contaRepository.delete(tx, usuario.conta.id),
        tx.usuario.update({ where: { id }, data: DELETED_USUARIO }),
      ]);
    });
  }
}

export const usuarioRepository = new UsuarioRepository();
