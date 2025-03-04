import { Router } from "express";

import { contaRoutes } from "./conta.routes";
import { seboRoutes } from "./sebo.routes";

export const routes = Router();

routes.use("/contas", contaRoutes);
routes.use("/sebos", seboRoutes);
