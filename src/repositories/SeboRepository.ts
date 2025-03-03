import { Prisma } from "@prisma/client";
import { EnderecoSeboRequestDTO, SeboRequestDTO } from "@src/models/SeboRequestDTO";
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
      const endereco = await this.createEndereco(tx, data.endereco, sebo.id);

      return { ...sebo, conta, endereco };
    });
  }

  private async createEndereco(tx: Prisma.TransactionClient, endereco: EnderecoSeboRequestDTO, seboId: number) {
    return tx.enderecoSebo.create({
      data: {
        cep: endereco.cep,
        estado: endereco.estado,
        cidade: endereco.cidade,
        bairro: endereco.bairro,
        rua: endereco.rua,
        numero: endereco.numero,
        complemento: endereco.complemento,
        isPublic: endereco.isPublic,
        sebo: {
          connect: { id: seboId },
        },
      },
    });
  }
}

export const seboRepository = new SeboRepository();
