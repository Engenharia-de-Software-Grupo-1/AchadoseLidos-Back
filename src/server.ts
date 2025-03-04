import "./config/module-alias";
import "express-async-errors";
import express, { ErrorRequestHandler } from "express";

import { routes } from './routes/routes';
import { AppError } from "./errors/AppError";

const app = express();

app.use(express.json());

app.use(routes);

const errorHandler: ErrorRequestHandler = (err, _req, res) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: "error",
    message: `Internal server error - ${err.message}`,
  });
};

app.use(errorHandler);

app.listen(3333, () => console.log('Server is running in port 3333'));
