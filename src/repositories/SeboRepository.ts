import { SeboRequestDTO } from "@src/models/SeboRequestDTO";
import { prismaClient } from "@src/lib/prismaClient";

import { contaRepository } from "./ContaRepository";

class SeboRepository {

  async create(data: SeboRequestDTO) {
    return prismaClient.$transaction(async(tx) => {
      //const hashSenha = await bcrypt.hash(data.conta.senha, 10);
      const conta = await contaRepository.create(tx, data.conta);
      const sebo = await tx.sebo.create({
        data: {
          nome: data.nome,
          cpfCnpj: data.cpfCnpj,
          concordaVender: data.concordaVender,
          telefone: data.telefone,
          biografia: data.biografia,
          estanteVirtual: data.estanteVirtual,
          instagram: data.instagram,
          curadores: data.curadores,
          historia: data.historia,
          fotoPerfil: data.fotoPerfil,
          conta: {
            connect: { id: conta.id },
          },
        },
      });
      const endereco = await tx.enderecoSebo.create({
        data: {
          cep: data.endereco.cep,
          estado: data.endereco.estado,
          cidade: data.endereco.cidade,
          bairro: data.endereco.bairro,
          rua: data.endereco.rua,
          numero: data.endereco.numero,
          complemento: data.endereco.complemento,
          isPublic: data.endereco.isPublic,
          sebo: {
            connect: { id: sebo.id },
          },
        },
      });
      return { ...sebo, conta, endereco };
    });
  }

  async getAll() {
    return prismaClient.sebo.findMany({
      include: { endereco: true },
    });
  }

  async getById(id: number) {
    return prismaClient.sebo.findUnique({
      where: { id },
      include: { endereco: true },
    });
  }

  async update(id: number, data: Partial<SeboRequestDTO>) {
    return prismaClient.sebo.update({
      where: { id },
      data: {
        nome: data.nome,
        cpfCnpj: data.cpfCnpj,
        concordaVender: data.concordaVender,
        telefone: data.telefone,
        biografia: data.biografia,
        estanteVirtual: data.estanteVirtual,
        instagram: data.instagram,
        curadores: data.curadores,
        historia: data.historia,
        fotoPerfil: data.fotoPerfil,
        endereco: data.endereco
          ? {
            update: {
              cep: data.endereco.cep,
              estado: data.endereco.estado,
              cidade: data.endereco.cidade,
              bairro: data.endereco.bairro,
              rua: data.endereco.rua,
              numero: data.endereco.numero,
              complemento: data.endereco.complemento,
              isPublic: data.endereco.isPublic,
            },
          }
          : undefined,
      },
      include: { endereco: true },
    });
  }
}

export const seboRepository = new SeboRepository();
