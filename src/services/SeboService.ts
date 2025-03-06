import { SeboCreateDTO, SeboCreateSchema, SeboResponseSchema, SeboUpdateDTO, SeboUpdateSchema } from "@src/models/SeboSchema";
import { seboRepository } from "@src/repositories/SeboRepository";
import { EntityNotFoundError } from "@src/errors/EntityNotFoundError";

import { contaService } from "./ContaService";

class SeboService {

  async create(data: SeboCreateDTO) {
    const parsedData = SeboCreateSchema.parse(data);
    await contaService.validarEmail(parsedData.conta.email);

    const result = await seboRepository.create(parsedData);
    return SeboResponseSchema.parseAsync(result);
  }

  async getAll() {
    const result = await seboRepository.getAll();
    return await SeboResponseSchema.array().parseAsync(result);
  }

  async getById(id: number) {
    const result = await seboRepository.getById(id);
    if (!result) {
      throw new EntityNotFoundError(id);
    }
    return SeboResponseSchema.parseAsync(result);
  }

  async update(id: number, data: SeboUpdateDTO) {
    const parsedData = SeboUpdateSchema.parse(data);
    await this.getById(id);

    const result = await seboRepository.update(id, parsedData);
    return SeboResponseSchema.parseAsync(result);
  }
}

export const seboService = new SeboService();
