import { AppError } from './AppError';
import { ErrorMessages } from './ErrorMessages';

export class EmailNotRegisteredError extends AppError {
  constructor() {
    super(ErrorMessages.emailNotRegistered, 404);
  }
}
