import { Router } from "express";
import { contaController } from "@src/controllers/ContaController";

export const contaRoutes = Router();

contaRoutes.get("/verificar_email", async(req, res) => {
  await contaController.verificarEmail(req, res);
});
