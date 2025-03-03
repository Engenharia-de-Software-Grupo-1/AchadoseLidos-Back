import { Papel, Status } from "@prisma/client";

interface ContaRequestDTO {
  email: string;
  senha: string;
  papel: Papel;
  status?: Status;
}

export { ContaRequestDTO };
