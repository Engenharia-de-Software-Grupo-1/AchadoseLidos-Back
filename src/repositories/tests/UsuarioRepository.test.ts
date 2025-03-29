import prismaClient from '@src/lib/prismaClient';
import { TipoConta } from '@prisma/client';
import { UsuarioCreateDTO, UsuarioUpdateDTO } from '@src/models/UsuarioSchema';

import { usuarioRepository } from '../UsuarioRepository';
import { contaRepository } from '../ContaRepository';
import { cestaRepository } from '../CestaRepository';
import { favoritoRepository } from '../FavoritoRepository';

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

  it('updates a usuario by id', async () => {
    const data: UsuarioUpdateDTO = {
      nome: 'usuario',
      cpf: '12345678911',
      telefone: '40028922',
    };

    (prismaClient.usuario.update as jest.Mock).mockResolvedValue(data);

    const result = await usuarioRepository.update(1, data);

    expect(prismaClient.usuario.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data,
    });
    expect(result).toEqual(data);
  });

  it('deletes a usuario by id', async () => {
    const usuario = {
      id: 1,
      nome: 'usuario',
      cpf: '12345678911',
      telefone: '40028922',
      conta: {
        id: 2,
        email: 'teste@exemplo.com',
        senha: 'senhaforte123',
      },
    };

    (usuarioRepository.getById as jest.Mock) = jest.fn().mockResolvedValue(usuario);
    (contaRepository.delete as jest.Mock) = jest.fn().mockResolvedValue(null);
    (favoritoRepository.deleteAllByUsuarioId as jest.Mock) = jest.fn().mockResolvedValue(null);
    (cestaRepository.deleteAllByUsuarioId as jest.Mock) = jest.fn().mockResolvedValue(null);
    (prismaClient.usuario.update as jest.Mock) = jest.fn().mockResolvedValue(null);
    (prismaClient.$transaction as jest.Mock) = jest.fn(async cb => cb(prismaClient));

    await usuarioRepository.delete(1);

    expect(prismaClient.$transaction).toHaveBeenCalled();
    expect(contaRepository.delete).toHaveBeenCalledWith(prismaClient, usuario.conta.id);
    expect(favoritoRepository.deleteAllByUsuarioId).toHaveBeenCalledWith(prismaClient, usuario.id);
    expect(cestaRepository.deleteAllByUsuarioId).toHaveBeenCalledWith(prismaClient, usuario.id);
    expect(prismaClient.usuario.update).toHaveBeenCalledWith({
      where: { id: usuario.id },
      data: expect.any(Object),
    });
  });
});
