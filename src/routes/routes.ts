import { Router } from "express";

import { contaRoutes } from "./conta.routes";
import { seboRoutes } from "./sebo.routes";

const routes = Router();

routes.use("/conta", contaRoutes);
routes.use("/sebo", seboRoutes);

export { routes };
