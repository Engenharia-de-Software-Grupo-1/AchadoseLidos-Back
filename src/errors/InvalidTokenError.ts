import { AppError } from './AppError';
import { ErrorMessages } from './ErrorMessages';

export class InvalidTokenError extends AppError {
  constructor() {
    super(ErrorMessages.invalidToken, 401);
  }
}
