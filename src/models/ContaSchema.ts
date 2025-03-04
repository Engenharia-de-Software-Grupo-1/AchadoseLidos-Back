import { z } from "zod";

const PapelEnum = z.enum(["SEBO", "USUARIO"]);
const StatusEnum = z.enum(["ATIVO", "EXCLUIDO"]);

export const contaSchema = z.object({
  email: z.string().email({ message: "Campo inválido" }),
  senha: z.string().min(8, { message: "Campo deve ter no mínimo 8 caracteres" }),
  papel: PapelEnum,
  status: StatusEnum.optional(),
});

export type ContaCreateDTO = z.infer<typeof contaSchema>;
