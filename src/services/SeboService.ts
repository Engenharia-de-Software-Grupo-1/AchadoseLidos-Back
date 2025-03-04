import { SeboRequestDTO } from "@src/models/SeboRequestDTO";
import { seboRepository } from "@src/repositories/SeboRepository";
import { AppError } from "@src/errors/AppError";

import { contaService } from "./ContaService";

class SeboService {

  async create(data: SeboRequestDTO) {
    await contaService.validarEmail(data.conta.email);
    const sebo = await seboRepository.create(data);
    return sebo;
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

  async update(id: number, data: Partial<SeboRequestDTO>) {
    await this.getById(id);
    return seboRepository.update(id, data);
  }
}

export const seboService = new SeboService();
