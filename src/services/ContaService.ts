import { contaRepository } from "@src/repositories/ContaRepository";
import { EmailIndisponivelError } from "@src/errors/EmailIndisponivelError";

class ContaService {

  async verificarEmail(email: string) {
    const emailExiste = await contaRepository.verificarEmailExiste(email);
    if (emailExiste) {
      throw new EmailIndisponivelError();
    }
  }
}

export const contaService =  new ContaService();
