import { AppError } from './AppError';
import { ErrorMessages } from './ErrorMessages';

export class TokenExpiredError extends AppError {
  constructor() {
    super(ErrorMessages.expiredToken, 401);
  }
}
