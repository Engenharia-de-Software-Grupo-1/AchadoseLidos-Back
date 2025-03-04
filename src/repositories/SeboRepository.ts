import { Prisma } from "@prisma/client";
import { EnderecoSeboRequestDTO, SeboRequestDTO } from "@src/models/SeboRequestDTO";
import { prismaClient } from "@src/lib/prismaClient";

import { contaRepository } from "./ContaRepository";

class SeboRepository {

  async create(sebo: SeboRequestDTO) {
    return prismaClient.$transaction(async(tx) => {
      //const hashSenha = await bcrypt.hash(sebo.conta.senha, 10);

      const contaCriada = await contaRepository.create(tx, sebo.conta);
      const seboCriado = await tx.sebo.create({
        data: {
          nome: sebo.nome,
          cpfCnpj: sebo.cpfCnpj,
          concordaVender: sebo.concordaVender,
          telefone: sebo.telefone,
          biografia: sebo.biografia,
          estanteVirtual: sebo.estanteVirtual,
          instagram: sebo.instagram,
          curadores: sebo.curadores,
          historia: sebo.historia,
          fotoPerfil: sebo.fotoPerfil,
          conta: {
            connect: { id: contaCriada.id },
          },
        },
      });
      const enderecoCriado = await this.createEndereco(tx, sebo.endereco, seboCriado.id);

      return { ...seboCriado, contaCriada, enderecoCriado };
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
