import { Papel, Status } from "@prisma/client";

export interface ContaRequestDTO {
  email: string;
  senha: string;
  papel: Papel;
  status?: Status;
}
