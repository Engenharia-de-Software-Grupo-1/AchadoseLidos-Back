import { AppError } from './AppError';
import { ErrorMessages } from './ErrorMessages';

export class IncorrectPasswordError extends AppError {
  constructor() {
    super(ErrorMessages.wrongPassword, 401);
  }
}
