import { AppError } from './AppError';
import { ErrorMessages } from './ErrorMessages';

export class ExpiredTokenError extends AppError {
  constructor() {
    super(ErrorMessages.expiredToken, 401);
  }
}
