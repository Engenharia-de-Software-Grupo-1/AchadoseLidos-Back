import { AppError } from "@src/errors/AppError";
import { contaRepository } from "@src/repositories/ContaRepository";

class ContaService {

  async validarEmail(email: string) {
    const emailJaExiste = await contaRepository.getByEmail(email);
    if (emailJaExiste) {
      throw new AppError("Já existe um cadastro para este e-mail!", 409);
    }
  }

  async delete(id: number) {
    const conta = await contaRepository.getById(id);
    if (!conta) {
      throw new AppError("Entidade não encontrada", 404);
    }
    await contaRepository.atualizarStatus(id, "EXCLUIDO");
  }
}

export const contaService =  new ContaService();
