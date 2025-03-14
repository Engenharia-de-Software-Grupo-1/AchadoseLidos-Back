import {
  UsuarioCreateDTO,
  UsuarioCreateSchema,
  UsuarioResponseSchema,
  UsuarioUpdateDTO,
  UsuarioUpdateSchema,
} from '@src/models/UsuarioSchema';
import { usuarioRepository } from '@src/repositories/UsuarioRepository';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';

import { contaService } from './ContaService';

class UsuarioService {
  async create(data: UsuarioCreateDTO) {
    const parsedData = UsuarioCreateSchema.parse(data);
    await contaService.validarEmail(parsedData.conta.email);

    const result = await usuarioRepository.create(parsedData);
    return UsuarioResponseSchema.parseAsync(result);
  }

  async getAll() {
    const result = await usuarioRepository.getAll();
    return await UsuarioResponseSchema.array().parseAsync(result);
  }

  async getById(id: number) {
    const result = await usuarioRepository.getById(id);
    if (!result) {
      throw new EntityNotFoundError(id);
    }
    return UsuarioResponseSchema.parseAsync(result);
  }

  async update(id: number, data: UsuarioUpdateDTO) {
    const parsedData = UsuarioUpdateSchema.parse(data);
    await this.getById(id);

    const result = await usuarioRepository.update(id, parsedData);
    return UsuarioResponseSchema.parseAsync(result);
  }
}

export const usuarioService = new UsuarioService();
