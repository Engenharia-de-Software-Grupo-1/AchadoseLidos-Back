import { z } from "zod";

const TipoConta = z.enum(["SEBO", "USUARIO"]);
const StatusConta = z.enum(["ATIVA", "EXCLUIDA"]);

export const contaSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(8),
  tipo: TipoConta,
  status: StatusConta,
});

export const contaCreateSchema = contaSchema.omit({ tipo: true, status: true });

export type ContaCreateDTO = z.infer<typeof contaCreateSchema>;
