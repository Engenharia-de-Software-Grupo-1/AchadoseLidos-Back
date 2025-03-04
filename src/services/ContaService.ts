import { AppError } from "@src/errors/AppError";
import { contaRepository } from "@src/repositories/ContaRepository";

class ContaService {

  async verificarEmail(email: string) {
    const emailExiste = await contaRepository.verificarEmailExiste(email);
    if (emailExiste) {
      throw new AppError("Já existe um cadastro para este e-mail!", 409);
    }
  }
}

export const contaService =  new ContaService();
