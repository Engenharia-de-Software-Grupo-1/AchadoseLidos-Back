import { StatusConta, TipoConta } from '@prisma/client';
import { contaRepository } from '@src/repositories/ContaRepository';
import prismaClient from '@src/lib/prismaClient';
import { genSalt, hash } from 'bcrypt';

import { prismaMock } from '../../lib/singleton';

jest.mock('@src/lib/prismaClient', () => ({
  prismaClient: {
    conta: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(() => 'mockedSalt'),
  hash: jest.fn(password => `hashed_${password}`),
}));

describe('ContaRepository', () => {
  const tx = prismaMock;

  it('creates a new account with hashed password', async() => {
    const data = { email: 'test@example.com', senha: 'password123' };
    const tipo = TipoConta.SEBO;
    const mockResponse = {
      id: 1,
      email: data.email,
      senha: 'hashed_password123',
      tipo,
      status: StatusConta.ATIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tx.conta.create.mockResolvedValue(mockResponse);

    const result = await contaRepository.create(tx, data, tipo);

    expect(genSalt).toHaveBeenCalledWith(10);
    expect(hash).toHaveBeenCalledWith(data.senha, 'mockedSalt');
    expect(tx.conta.create).toHaveBeenCalledWith({
      data: {
        email: data.email,
        senha: 'hashed_password123',
        tipo,
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('retrieves an account by ID', async() => {
    const mockAccount = { id: 1, email: 'test@example.com' };
    (prismaClient.conta.findUnique as jest.Mock).mockResolvedValue(mockAccount);

    const result = await contaRepository.getById(1);

    expect(prismaClient.conta.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(mockAccount);
  });

  it('retrieves an account by email', async() => {
    const mockAccount = { id: 1, email: 'test@example.com' };
    (prismaClient.conta.findUnique as jest.Mock).mockResolvedValue(mockAccount);

    const result = await contaRepository.getByEmail('test@example.com');

    expect(prismaClient.conta.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(result).toEqual(mockAccount);
  });

  it('updates account status', async() => {
    const mockResponse = { id: 1, status: StatusConta.ATIVA };
    (prismaClient.conta.update as jest.Mock).mockResolvedValue(mockResponse);

    const result = await contaRepository.atualizarStatus(1, StatusConta.ATIVA);

    expect(prismaClient.conta.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: StatusConta.ATIVA },
    });
    expect(result).toEqual(mockResponse);
  });
});
