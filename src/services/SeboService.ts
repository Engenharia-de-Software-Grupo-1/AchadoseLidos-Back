import { SeboRequestDTO } from "@src/models/SeboRequestDTO";
import { seboRepository } from "@src/repositories/SeboRepository";

import { contaService } from "./ContaService";

class SeboService {

  async create(data: SeboRequestDTO) {
    await contaService.verificarEmail(data.conta.email);

    const sebo = await seboRepository.create(data);
    return sebo;
  }
}

export const seboService = new SeboService();
