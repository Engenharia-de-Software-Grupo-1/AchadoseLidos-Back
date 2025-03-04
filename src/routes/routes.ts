import { Router } from "express";

import { contaRoutes } from "./conta.routes";
import { seboRoutes } from "./sebo.routes";

export const routes = Router();

routes.use("/conta", contaRoutes);
routes.use("/sebo", seboRoutes);
