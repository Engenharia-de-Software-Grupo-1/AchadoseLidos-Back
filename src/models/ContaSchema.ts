import { z } from "zod";

export const contaSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(8),
});

export type ContaCreateDTO = z.infer<typeof contaSchema>;
