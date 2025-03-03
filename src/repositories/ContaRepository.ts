import { prisma } from "@src/lib/prisma";

class ContaRepository {

  async verificarEmailExiste(email: string) {
    return await prisma.conta.findUnique({
      where: { email },
      select: { id: true },
    }) != null;
  }
}

export const contaRepository =  new ContaRepository();
