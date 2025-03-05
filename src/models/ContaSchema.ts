import { z } from "zod";

const PapelEnum = z.enum(["SEBO", "USUARIO"]);
const StatusEnum = z.enum(["ATIVO", "EXCLUIDO"]);

export const contaSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(8),
  papel: PapelEnum.nullable().optional(),
  status: StatusEnum.nullable().optional(),
});

export type ContaCreateDTO = z.infer<typeof contaSchema>;
