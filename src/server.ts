import 'dotenv/config';
import './config/module-alias';
import 'express-async-errors';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import cookieParser from 'cookie-parser';

import { routes } from './routes/routes';
import { AppError } from './errors/AppError';
import { ErrorMessages } from './errors/ErrorMessages';

const app = express();
const port = process.env.PORT ?? 3333;

app.disable('x-powered-by');

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(error => ({
      message: `${error.path.join('.')}: ${error.message}`,
    }));
    res.status(400).json({ errors: formattedErrors });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ message: ErrorMessages.serverError });
};

app.use(errorHandler);
app.listen(port, () => console.log(`Server is running in port ${port}`));
