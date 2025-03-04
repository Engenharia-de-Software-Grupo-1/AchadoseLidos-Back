import { SeboCreateDTO, seboCreateSchema, SeboUpdateDTO, seboUpdateSchema } from "@src/models/SeboSchema";
import { seboRepository } from "@src/repositories/SeboRepository";
import { AppError } from "@src/errors/AppError";

import { contaService } from "./ContaService";

class SeboService {

  async create(data: SeboCreateDTO) {
    const parsedData = seboCreateSchema.parse(data);
    await contaService.validarEmail(parsedData.conta.email);
    return seboRepository.create(data);;
  }

  async getAll() {
    return seboRepository.getAll();
  }

  async getById(id: number) {
    const sebo = await seboRepository.getById(id);
    if (!sebo) {
      throw new AppError("Entidade não encontrada", 404);
    }
    return sebo;
  }

  async update(id: number, data: SeboUpdateDTO) {
    const parsedData = seboUpdateSchema.parse(data);
    await this.getById(id);
    return seboRepository.update(id, parsedData);
  }
}

export const seboService = new SeboService();
