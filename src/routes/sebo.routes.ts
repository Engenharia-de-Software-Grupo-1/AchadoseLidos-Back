import { Router } from "express";
import { seboController } from "@src/controllers/SeboController";

const seboRoutes = Router();

seboRoutes.post("/", async(req, res) => {
  await seboController.create(req, res);
});

export { seboRoutes };
