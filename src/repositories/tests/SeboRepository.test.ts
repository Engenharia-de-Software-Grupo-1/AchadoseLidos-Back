import prismaClient from "@src/lib/prismaClient";
import { TipoConta } from "@prisma/client";
import { SeboCreateDTO, SeboUpdateDTO } from "@src/models/SeboSchema";

import { seboRepository } from "../SeboRepository";
import { contaRepository } from "../ContaRepository";

jest.mock("@src/lib/prismaClient");

jest.mock("../ContaRepository", () => ({
  contaRepository: {
    create: jest.fn(),
  },
}));

describe("SeboRepository", () => {
  it("creates a new sebo", async() => {
    const data: SeboCreateDTO = {
      nome: "Example Name",
      cpfCnpj: "123.456.789-00",
      concordaVender: true,
      conta: {
        email: "example@example.com",
        senha: "password123",
      },
      endereco: {
        cep: "12345-678",
        estado: "Estado",
        cidade: "Cidade",
        bairro: "Bairro",
        rua: "Rua",
        numero: "123",
        ehPublico: true,
        complemento: "Complemento",
      },
      fotos: [{ url: "http://example.com/foto1" }],
    };

    const contaCriada = { id: 123 };
    const seboCriado = { id: 456 };
    const enderecoCriado = { id: 789 };

    (prismaClient.$transaction as jest.Mock).mockImplementation(async(fn) =>
      fn({
        sebo: { create: jest.fn().mockResolvedValue(seboCriado) },
        enderecoSebo: { create: jest.fn().mockResolvedValue(enderecoCriado) },
      }),
    );
    (contaRepository.create as jest.Mock).mockResolvedValue(contaCriada);

    const result = await seboRepository.create(data);

    expect(result).toEqual({
      ...seboCriado,
      conta: contaCriada,
      endereco: enderecoCriado,
    });
    expect(contaRepository.create).toHaveBeenCalledWith(
      expect.anything(),
      data.conta,
      TipoConta.SEBO,
    );
  });

  it("returns all sebos", async() => {
    const sebos = [
      {
        id: 1,
        endereco: {
          cep: "12345-678",
          estado: "Estado",
          cidade: "Cidade",
          bairro: "Bairro",
          rua: "Rua",
          numero: "123",
          ehPublico: true,
          complemento: "Complemento",
        },
      },
    ];
    (prismaClient.sebo.findMany as jest.Mock).mockResolvedValue(sebos);

    const result = await seboRepository.getAll();

    expect(result).toEqual(sebos);
    expect(prismaClient.sebo.findMany).toHaveBeenCalledWith({
      include: { endereco: true },
    });
  });

  it("returns a sebo by id", async() => {
    const sebo = {
      id: 1,
      endereco: {
        cep: "12345-678",
        estado: "Estado",
        cidade: "Cidade",
        bairro: "Bairro",
        rua: "Rua",
        numero: "123",
        ehPublico: true,
        complemento: "Complemento",
      },
      fotos: [{ url: "http://example.com/foto1" }],
    };
    (prismaClient.sebo.findUnique as jest.Mock).mockResolvedValue(sebo);

    const result = await seboRepository.getById(1);

    expect(result).toEqual(sebo);
    expect(prismaClient.sebo.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { endereco: true, fotos: true },
    });
  });

  it("updates a sebo by id", async() => {
    const seboId = 1;
    const sebo: SeboUpdateDTO = {
      id: seboId,
      nome: "Example Name",
      cpfCnpj: "123.456.789-00",
      concordaVender: false,
      endereco: {
        cep: "12345-678",
        estado: "Estado",
        cidade: "Cidade",
        bairro: "Bairro",
        rua: "Rua",
        numero: "123",
        ehPublico: true,
        complemento: "Complemento",
      },
      fotos: [{ url: "http://example.com/foto1" }],
    };

    (prismaClient.$transaction as jest.Mock).mockImplementation(async(fn) =>
      fn({
        sebo: { update: jest.fn() },
        enderecoSebo: { update: jest.fn() },
        fotoSebo: { deleteMany: jest.fn(), createMany: jest.fn() },
      }),
    );

    (prismaClient.sebo.findUnique as jest.Mock).mockResolvedValue(sebo);

    const result = await seboRepository.update(seboId, sebo);

    expect(result).toEqual(sebo);
    expect(prismaClient.$transaction).toHaveBeenCalled();
    expect(prismaClient.sebo.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { endereco: true, fotos: true },
    });
  });
});
