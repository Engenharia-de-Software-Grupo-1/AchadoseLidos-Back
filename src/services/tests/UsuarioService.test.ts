import {
  UsuarioCreateDTO,
  UsuarioCreateSchema,
  UsuarioPrivateResponseSchema,
  UsuarioResponseSchema,
  UsuarioUpdateDTO,
  UsuarioUpdateSchema,
} from '@src/models/UsuarioSchema';
import { usuarioRepository } from '@src/repositories/UsuarioRepository';
import { ensureSelfTargetedAction } from '@src/utils/authUtils';

import { contaService } from '../ContaService';
import { usuarioService } from '../UsuarioService';

jest.mock('@src/repositories/UsuarioRepository');
jest.mock('@src/models/UsuarioSchema');
jest.mock('@src/services/ContaService');
jest.mock('@src/utils/authUtils');

describe('UsuarioService', () => {
  it('creates a new usuario', async () => {
    const data: UsuarioCreateDTO = {
      nome: 'usuario',
      cpf: '12345678911',
      telefone: '40028922',
      conta: {
        email: 'teste@exemplo.com',
        senha: 'senhaforte123',
      },
    };

    const usuario = {
      id: 1,
      ...data,
    };

    (UsuarioCreateSchema.parse as jest.Mock).mockReturnValue(data);
    (contaService.validarEmail as jest.Mock).mockResolvedValue(undefined);
    (usuarioRepository.create as jest.Mock).mockResolvedValue(usuario);
    (UsuarioResponseSchema.parseAsync as jest.Mock).mockResolvedValue(usuario);

    const result = await usuarioService.create(data);

    expect(UsuarioCreateSchema.parse).toHaveBeenCalledWith(data);
    expect(contaService.validarEmail).toHaveBeenCalledWith('teste@exemplo.com');
    expect(usuarioRepository.create).toHaveBeenCalledWith(data);
    expect(UsuarioResponseSchema.parseAsync).toHaveBeenCalledWith(usuario);
    expect(result).toEqual(usuario);
  });

  it('returns all usuarios', async () => {
    const usuarios = [
      {
        id: 1,
        nome: 'usuario',
        cpf: '12345678911',
        telefone: '40028922',
        conta: {
          email: 'teste@exemplo.com',
          senha: 'senhaforte123',
        },
      },
      {
        id: 2,
        nome: 'usuario2',
        cpf: '12345600000',
        telefone: '80028922',
        conta: {
          email: 'teste2@exemplo.com',
          senha: 'senhaforte123',
        },
      },
    ];

    (usuarioRepository.getAll as jest.Mock).mockResolvedValue(usuarios);
    (UsuarioResponseSchema.array as jest.Mock).mockReturnValue({
      parseAsync: jest.fn().mockResolvedValue(usuarios),
    });

    const result = await usuarioService.getAll();

    expect(usuarioRepository.getAll).toHaveBeenCalled();
    expect(UsuarioResponseSchema.array().parseAsync).toHaveBeenCalledWith(usuarios);
    expect(result).toEqual(usuarios);
  });

  it('returns a usuario by id', async () => {
    const usuario = {
      id: 1,
      nome: 'usuario',
      cpf: '12345678911',
      telefone: '40028922',
      conta: {
        email: 'teste@exemplo.com',
        senha: 'senhaforte123',
      },
    };

    (usuarioRepository.getById as jest.Mock).mockResolvedValue(usuario);
    (UsuarioResponseSchema.parseAsync as jest.Mock).mockResolvedValue(usuario);

    const result = await usuarioService.getById(1);

    expect(usuarioRepository.getById).toHaveBeenCalledWith(1);
    expect(UsuarioResponseSchema.parseAsync).toHaveBeenCalledWith(usuario);
    expect(result).toEqual(usuario);
  });

  it('should throw an error when getById is called and usuario does not exist', async () => {
    (usuarioRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(usuarioService.getById(1)).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });

  it('returns a profile by id', async () => {
    const usuario = {
      id: 1,
      nome: 'usuario',
      cpf: '12345678911',
      telefone: '40028922',
      conta: {
        email: 'teste@exemplo.com',
        senha: 'senhaforte123',
      },
    };

    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {});
    (usuarioRepository.getById as jest.Mock).mockResolvedValue(usuario);
    (UsuarioPrivateResponseSchema.parseAsync as jest.Mock).mockResolvedValue(usuario);

    const result = await usuarioService.getPerfilById(1, 'testToken');

    expect(ensureSelfTargetedAction).toHaveBeenCalledWith(1, 'testToken');
    expect(usuarioRepository.getById).toHaveBeenCalledWith(1);
    expect(UsuarioPrivateResponseSchema.parseAsync).toHaveBeenCalledWith(usuario);
    expect(result).toEqual(usuario);
  });

  it('should throw an error when getPerfilById is called and entity does not exist', async () => {
    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {});
    (usuarioRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(usuarioService.getById(1)).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });

  it('updates a product by id', async () => {
    const usuario: UsuarioUpdateDTO = {
      nome: 'usuario',
      cpf: '12345678911',
      telefone: '4002892',
    };

    const usuarioResponse = {
      id: 1,
    };

    (UsuarioUpdateSchema.parse as jest.Mock).mockReturnValue(usuario);
    (usuarioRepository.getById as jest.Mock).mockResolvedValue(usuarioResponse);
    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {});
    (usuarioRepository.update as jest.Mock).mockResolvedValue(usuarioResponse);
    (UsuarioResponseSchema.parseAsync as jest.Mock).mockResolvedValue(usuarioResponse);

    const result = await usuarioService.update(1, usuario, 'testToken');

    expect(UsuarioUpdateSchema.parse).toHaveBeenCalledWith(usuario);
    expect(usuarioRepository.getById).toHaveBeenCalledWith(1);
    expect(ensureSelfTargetedAction).toHaveBeenCalledWith(1, 'testToken');
    expect(usuarioRepository.update).toHaveBeenCalledWith(1, usuario);
    expect(UsuarioResponseSchema.parseAsync).toHaveBeenCalledWith(usuarioResponse);
    expect(result).toEqual(usuarioResponse);
  });

  it('should throw an error when update is called and product does not exist', async () => {
    const usuario: UsuarioUpdateDTO = {
      nome: 'usuario',
      cpf: '12345678911',
      telefone: '40028922',
    };

    (UsuarioUpdateSchema.parse as jest.Mock).mockReturnValue(undefined);
    (usuarioRepository.getById as jest.Mock).mockResolvedValue(undefined);

    await expect(usuarioService.update(1, usuario, 'testToken')).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });

  it('deletes a product by id', async () => {
    const usuarioResponse = {
      id: 1,
      nome: 'usuario',
    };

    (usuarioRepository.getById as jest.Mock).mockResolvedValueOnce(usuarioResponse);
    (ensureSelfTargetedAction as jest.Mock).mockImplementation(() => {});
    (usuarioRepository.delete as jest.Mock).mockResolvedValueOnce(usuarioResponse);

    await usuarioService.delete(1, 'testToken');

    expect(usuarioRepository.getById).toHaveBeenCalledWith(1);
    expect(ensureSelfTargetedAction).toHaveBeenCalledWith(1, 'testToken');
    expect(usuarioRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw an error when delete is called and product does not exist', async () => {
    (usuarioRepository.getById as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(usuarioService.delete(1, 'testToken')).rejects.toEqual({
      message: 'Entidade com id 1 não encontrada',
      statusCode: 404,
    });
  });
});
