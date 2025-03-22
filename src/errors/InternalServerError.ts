import { AppError } from './AppError';
import { ErrorMessages } from './ErrorMessages';

export class InternalServerError extends AppError {
  constructor() {
    super(ErrorMessages.serverError, 500);
  }
}
