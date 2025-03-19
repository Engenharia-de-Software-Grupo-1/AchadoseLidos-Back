import { AppError } from './AppError';
import { ErrorMessages } from './ErrorMessages';

export class TokenInvalidError extends AppError {
  constructor() {
    super(ErrorMessages.invalidToken, 401);
  }
}
