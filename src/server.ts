import './config/module-alias';
import 'express-async-errors';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { routes } from './routes/routes';
import { AppError } from './errors/AppError';

const app = express();

app.use(cors());
app.use(express.json());
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
  res.status(500).json({ message: 'Internal server error' });
};

app.use(errorHandler);
app.listen(3333, () => console.log('Server is running in port 3333'));
