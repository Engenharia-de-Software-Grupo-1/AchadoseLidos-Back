import {
  SeboCreateDTO,
  SeboCreateSchema,
  SeboPrivateResponseSchema,
  SeboResponseSchema,
  SeboUpdateDTO,
  SeboUpdateSchema,
} from '@src/models/SeboSchema';
import { seboRepository } from '@src/repositories/SeboRepository';
import { ensureSelfTargetedAction } from '@src/utils/authUtils';
import { NoPermissionError } from '@src/errors/NoPermissionError';

import { contaService } from '../ContaService';
import { seboService } from '../SeboService';

jest.mock('@src/repositories/SeboRepository');
jest.mock('@src/models/SeboSchema');
jest.mock('@src/services/ContaService');
jest.mock('@src/utils/authUtils');

describe('SeboService', () => {
  it('creates a new sebo', async () => {
    const data: SeboCreateDTO = {
      nome: 'sebo de teste',
      concordaVender: true,
      cpfCnpj: '10102030432',
      conta: {
        email: 'teste@exemplo.com',
        senha: 'senhaforte123',
      },
      endereco: {
        cep: '12345678',
        estado: 'pb',
        cidade: 'campina grande',
        bairro: 'centro',
        rua: 'rua das letras',
        numero: '123',
        ehPublico: true,
      },
    };

    const seboCriado = {
      id: 1,
      ...data,
    };

    (SeboCreateSchema.parse as jest.Mock).mockReturnValue(data);
    (contaService.validarEmail as jest.Mock).mockResolvedValue(undefined);
    (seboRepository.create as jest.Mock).mockResolvedValue(seboCriado);
    (SeboResponseSchema.parseAsync as jest.Mock).mockResolvedValue(seboCriado);

    const result = await seboService.create(data);

    expect(SeboCreateSchema.parse).toHaveBeenCalledWith(data);
    expect(contaService.validarEmail).toHaveBeenCalledWith('teste@exemplo.com');
    expect(seboRepository.create).toHaveBeenCalledWith(data);
    expect(SeboResponseSchema.parseAsync).toHaveBeenCalledWith(seboCriado);
    expect(result).toEqual(seboCriado);
  });

  it('returns all sebos', async () => {
    const sebos = [
      {
        id: 1,
        nome: 'sebo de teste',
        concordaVender: true,
        cpfCnpj: '10102030432',
        conta: {
          email: 'teste@exemplo.com',
          senha: 'senhaforte123',
        },
        endereco: {
          cep: '12345678',
          estado: 'pb',
          cidade: 'campina grande',
          bairro: 'centro',
          rua: 'rua das letras',
          numero: '123',
          ehPublico: true,
        },
      },
      {
        id: 2,
        nome: 'seboteca',
        concordaVender: true,
        cpfCnpj: '11111122234',
        conta: {
          email: 'teste2@exemplo.com',
          senha: 'senhaforte123',
        },
        endereco: {
          cep: '12345678',
          estado: 'pb',
          cidade: 'campina grande',
          bairro: 'centro',
          rua: 'rua das vogais',
          numero: '321',
          ehPublico: true,
        },
      },
    ];

    (seboRepository.getAll as jest.Mock).mockResolvedValue(sebos);
    (SeboResponseSchema.array as jest.Mock).mockReturnValue({
      parseAsync: jest.fn().mockResolvedValue(sebos),
    });

    const result = await seboService.getAll({
      filters: [],
      sorters: [],
    });

    expect(seboRepository.getAll).toHaveBeenCalled();
    expect(SeboResponseSchema.array().parseAsync).toHaveBeenCalledWith(sebos);
    expect(result).toEqual(sebos);
  });

  it('returns all filtered sebos', async () => {
    const sebos = [
      {
        id: 1,
        nome: 'sebo de teste',
        concordaVender: true,
        cpfCnpj: '10102030432',
        conta: {
          email: 'teste@exemplo.com',
          senha: 'senhaforte123',
        },
        endereco: {
          cep: '12345678',
          estado: 'pb',
          cidade: 'campina grande',
          bairro: 'centro',
          rua: 'rua das letras',
          numero: '123',
          ehPublico: true,
        },
      },
      {
        id: 2,
        nome: 'seboteca',
        concordaVender: true,
        cpfCnpj: '11111122234',
        conta: {
          email: 'teste2@exemplo.com',
          senha: 'senhaforte123',
        },
        endereco: {
          cep: '12345678',
          estado: 'pb',
          cidade: 'campina grande',
          bairro: 'centro',
          rua: 'rua das vogais',
          numero: '321',
          ehPublico: true,
        },
      },
    ];

    (seboRepository.getAll as jest.Mock).mockResolvedValue(sebos);
    (SeboResponseSchema.array as jest.Mock).mockReturnValue({
      parseAsync: jest.fn().mockResolvedValue(sebos),
    });

    const result = await seboService.getAll({
      filters: [
        {
          campo: 'bairro',
          operador: 'in',
          valor: 'centro',
        },
      ],
      sorters: [],
    });

    expect(seboRepository.getAll).toHaveBeenCalledWith({
      filters: [
        {
          campo: 'bairro',
          operador: 'in',
          valor: 'centro',
        },
      ],
      sorters: [],
    });
    expect(SeboResponseSchema.array().parseAsync).toHaveBeenCalledWith(sebos);
    expect(result).toEqual(sebos);
  });

  it('returns all sebos sorted', async () => {
    const sebos = [
      {
        id: 1,
        nome: 'sebo de teste',
        concordaVender: true,
        cpfCnpj: '10102030432',
        conta: {
          email: 'teste@exemplo.com',
          senha: 'senhaforte123',
        },
        endereco: {
          cep: '12345678',
          estado: 'pb',
          cidade: 'campina grande',
          bairro: 'centro',
          rua: 'rua das letras',
          numero: '123',
          ehPublico: true,
        },
      },
      {
        id: 2,
        nome: 'seboteca',
        concordaVender: true,
        cpfCnpj: '11111122234',
        conta: {
          email: 'teste2@exemplo.com',
          senha: 'senhaforte123',
        },
        endereco: {
          cep: '12345678',
          estado: 'pb',
          cidade: 'campina grande',
          bairro: 'centro',
          rua: 'rua das vogais',
          numero: '321',
          ehPublico: true,
        },
      },
    ];

    (seboRepository.getAll as jest.Mock).mockResolvedValue(sebos);
    (SeboResponseSchema.array as jest.Mock).mockReturnValue({
      parseAsync: jest.fn().mockResolvedValue(sebos),
    });

    const result = await seboService.getAll({
      filters: [
        {
          campo: 'bairro',
          operador: 'in',
          valor: 'centro',
        },
      ],
      sorters: [
        {
          campo: 'nome',
          ordem: 'ASC',
        },
      ],
    });

    expect(seboRepository.getAll).toHaveBeenCalledWith({
      filters: [
        {
          campo: 'bairro',
          operador: 'in',
          valor: 'centro',
        },
      ],
      sorters: [
        {
          campo: 'nome',
          ordem: 'ASC',
        },
      ],
    });
    expect(SeboResponseSchema.array().parseAsync).toHaveBeenCalledWith(sebos);
    expect(result).toEqual(sebos);
  });

  it('returns a sebo by id', async () => {
    const sebo = {
      id: 1,
      nome: 'sebo de teste',
      concordaVender: true,
      cpfCnpj: '10102030432',
      conta: {
        email: 'teste@exemplo.com',
        senha: 'senhaforte123',
      },
      endereco: {
        cep: '12345678',
        estado: 'pb',
        cidade: 'campina grande',
        bairro: 'centro',
        rua: 'rua das letras',
        numero: '123',
        ehPublico: true,
      },
    };

    (seboRepository.getById as jest.Mock).mockResolvedValue(sebo);
    (SeboResponseSchema.parseAsync as jest.Mock).mockResolvedValue(sebo);

    const result = await seboService.getById(1);

    expect(seboRepository.getById).toHaveBeenCalledWith(1);
    expect(SeboResponseSchema.parseAsync).toHaveBeenCalledWith(sebo);
    expect(result).toEqual(sebo);
  });

  it('should throw an error when getById is called and sebo does not exist', async () => {
    (seboRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(seboService.getById(1)).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });

  it('returns a profile by id', async () => {
    const sebo = {
      id: 1,
      nome: 'sebo de teste',
      concordaVender: true,
      cpfCnpj: '10102030432',
      conta: {
        email: 'teste@exemplo.com',
        senha: 'senhaforte123',
      },
      endereco: {
        cep: '12345678',
        estado: 'pb',
        cidade: 'campina grande',
        bairro: 'centro',
        rua: 'rua das letras',
        numero: '123',
        ehPublico: true,
      },
    };

    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {});
    (seboRepository.getById as jest.Mock).mockResolvedValue(sebo);
    (SeboPrivateResponseSchema.parseAsync as jest.Mock).mockResolvedValue(sebo);

    const result = await seboService.getPerfilById(1, 'testToken');

    expect(ensureSelfTargetedAction).toHaveBeenCalledWith(1, 'testToken');
    expect(seboRepository.getById).toHaveBeenCalledWith(1);
    expect(SeboPrivateResponseSchema.parseAsync).toHaveBeenCalledWith(sebo);
    expect(result).toEqual(sebo);
  });

  it('should throw an error when getPerfilById is called and entity does not exist', async () => {
    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {});
    (seboRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(seboService.getById(1)).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });

  it('should throw an error when getPerfil is called without permission', async () => {
    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {
      throw new NoPermissionError();
    });

    await expect(seboService.getPerfilById(1, 'unauthorizedToken')).rejects.toEqual({
      message: 'Acesso negado. Você não tem permissão para essa ação',
      statusCode: 403,
    });
  });

  it('updates a sebo by id', async () => {
    const sebo: SeboUpdateDTO = {
      nome: 'sebo de teste',
      concordaVender: true,
      cpfCnpj: '10102030432',
      endereco: {
        cep: '12345678',
        estado: 'pb',
        cidade: 'campina grande',
        bairro: 'centro',
        rua: 'rua das letras',
        numero: '123',
        ehPublico: true,
      },
    };

    const seboResponse = {
      id: 1,
      ...sebo,
    };

    (SeboUpdateSchema.parse as jest.Mock).mockReturnValue(sebo);
    (seboRepository.getById as jest.Mock).mockResolvedValue(seboResponse);
    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {});
    (seboRepository.update as jest.Mock).mockResolvedValue(seboResponse);
    (SeboResponseSchema.parseAsync as jest.Mock).mockResolvedValue(seboResponse);

    const result = await seboService.update(1, sebo, 'testToken');

    expect(SeboUpdateSchema.parse).toHaveBeenCalledWith(sebo);
    expect(seboRepository.getById).toHaveBeenCalledWith(1);
    expect(ensureSelfTargetedAction).toHaveBeenCalledWith(1, 'testToken');
    expect(seboRepository.update).toHaveBeenCalledWith(1, sebo);
    expect(SeboResponseSchema.parseAsync).toHaveBeenCalledWith(seboResponse);
    expect(result).toEqual(seboResponse);
  });

  it('should throw an error when update is called and sebo does not exist', async () => {
    const sebo: SeboUpdateDTO = {
      nome: 'sebo de teste',
      concordaVender: true,
      cpfCnpj: '10102030432',
      endereco: {
        cep: '12345678',
        estado: 'pb',
        cidade: 'campina grande',
        bairro: 'centro',
        rua: 'rua das letras',
        numero: '123',
        ehPublico: true,
      },
    };

    (SeboUpdateSchema.parse as jest.Mock).mockReturnValue(sebo);
    (seboRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(seboService.update(1, sebo, 'testToken')).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });

  it('should throw an error when update is called without permission', async () => {
    const sebo: SeboUpdateDTO = {
      nome: 'sebo de teste',
      concordaVender: true,
      cpfCnpj: '10102030432',
      endereco: {
        cep: '12345678',
        estado: 'pb',
        cidade: 'campina grande',
        bairro: 'centro',
        rua: 'rua das letras',
        numero: '123',
        ehPublico: true,
      },
    };

    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {
      throw new NoPermissionError();
    });

    await expect(seboService.update(1, sebo, 'unauthorizedToken')).rejects.toEqual({
      message: 'Acesso negado. Você não tem permissão para essa ação',
      statusCode: 403,
    });
  });

  it('deletes a sebo by id', async () => {
    const sebo = {
      id: 1,
      nome: 'sebo de teste',
      concordaVender: true,
      cpfCnpj: '10102030432',
      conta: {
        email: 'teste@exemplo.com',
        senha: 'senhaforte123',
      },
      endereco: {
        cep: '12345678',
        estado: 'pb',
        cidade: 'campina grande',
        bairro: 'centro',
        rua: 'rua das letras',
        numero: '123',
        ehPublico: true,
      },
    };

    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {});
    (seboRepository.getById as jest.Mock).mockResolvedValue(sebo);
    (seboRepository.delete as jest.Mock).mockResolvedValue(sebo);

    await seboService.delete(1, 'testToken');

    expect(ensureSelfTargetedAction).toHaveBeenCalledWith(1, 'testToken');
    expect(seboRepository.getById).toHaveBeenCalledWith(1);
    expect(seboRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw an error when delete is called and sebo does not exist', async () => {
    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {});
    (seboRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(seboService.delete(1, 'testToken')).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });

  it('should throw an error when delete is called without permission', async () => {
    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {
      throw new NoPermissionError();
    });

    await expect(seboService.delete(1, 'unauthorizedToken')).rejects.toEqual({
      message: 'Acesso negado. Você não tem permissão para essa ação',
      statusCode: 403,
    });
  });
});
