import {
  SeboCreateDTO,
  SeboCreateSchema,
  SeboPrivateResponseSchema,
  SeboResponseSchema,
  SeboUpdateDTO,
  SeboUpdateSchema,
} from '@src/models/SeboSchema';
import { seboRepository } from '@src/repositories/SeboRepository';
import { EntityNotFoundError } from '@src/errors/EntityNotFoundError';
import { ensureSelfTargetedAction } from '@src/utils/authUtils';
import { Filter, Sorter } from '@src/utils/filterUtils';

import { contaService } from './ContaService';

class SeboService {
  async create(data: SeboCreateDTO) {
    const parsedData = SeboCreateSchema.parse(data);
    await contaService.validarEmail(parsedData.conta.email);

    const result = await seboRepository.create(parsedData);
    return SeboResponseSchema.parseAsync(result);
  }

  async getAll(data: { filters: Filter[]; sorters: Sorter[] }) {
    const result = await seboRepository.getAll(data);
    return await SeboResponseSchema.array().parseAsync(result);
  }

  async getById(id: number) {
    const result = await seboRepository.getById(id);
    if (!result) {
      throw new EntityNotFoundError(id);
    }
    return SeboResponseSchema.parseAsync(result);
  }

  async getPerfilById(id: number, authToken: unknown) {
    ensureSelfTargetedAction(id, authToken);
    const result = await seboRepository.getById(id);
    if (!result) {
      throw new EntityNotFoundError(id);
    }
    return SeboPrivateResponseSchema.parseAsync(result);
  }

  async update(id: number, data: SeboUpdateDTO, authToken: unknown) {
    ensureSelfTargetedAction(id, authToken);

    const parsedData = SeboUpdateSchema.parse(data);
    await this.getById(id);

    const result = await seboRepository.update(id, parsedData);
    return SeboResponseSchema.parseAsync(result);
  }

  async delete(id: number, authToken: unknown) {
    ensureSelfTargetedAction(id, authToken);

    await this.getById(id);
    await seboRepository.delete(id);
  }
}

export const seboService = new SeboService();
