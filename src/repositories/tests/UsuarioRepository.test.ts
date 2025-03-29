import prismaClient from '@src/lib/prismaClient';
import { StatusConta, TipoConta } from '@prisma/client';
import { UsuarioCreateDTO, UsuarioUpdateDTO } from '@src/models/UsuarioSchema';

import { usuarioRepository } from '../UsuarioRepository';
import { contaRepository } from '../ContaRepository';

jest.mock('@src/lib/prismaClient');

jest.mock('../ContaRepository', () => ({
  contaRepository: {
    create: jest.fn(),
  },
}));

describe('UsuarioRepository', () => {
  it('creates a new usuario', async () => {
    const data: UsuarioCreateDTO = {
      nome: 'Example Name',
      cpf: '123.456.789-00',
      telefone: '12345678900',
      conta: {
        email: 'email@teste',
        senha: 'password123',
      },
    };

    const contaCriada = { id: 123 };
    const usuarioCriado = { conta: { id: 123 } };

    (prismaClient.$transaction as jest.Mock).mockImplementation(async fn =>
      fn({
        usuario: { create: jest.fn().mockResolvedValue(usuarioCriado) },
        contaCriada: { create: jest.fn().mockResolvedValue(contaCriada) },
      }),
    );
    (contaRepository.create as jest.Mock).mockResolvedValue(contaCriada);

    const result = await usuarioRepository.create(data);

    expect(result).toEqual({
      ...usuarioCriado,
      conta: contaCriada,
    });
    expect(contaRepository.create).toHaveBeenCalledWith(expect.anything(), data.conta, TipoConta.USUARIO);
  });

  it('returns all usuarios', async () => {
    const mockResult = [{ someResultKey: 'someResultValue' }];

    (prismaClient.usuario.findMany as jest.Mock).mockResolvedValueOnce(mockResult);

    const result = await usuarioRepository.getAll();

    expect(result).toEqual(mockResult);
  });

  it('returns a usuario by id', async () => {
    const mockResult = { someResultKey: 'someResultValue' };

    (prismaClient.usuario.findUnique as jest.Mock).mockResolvedValueOnce(mockResult);

    const result = await usuarioRepository.getById(1);

    expect(result).toEqual(mockResult);
  });
});