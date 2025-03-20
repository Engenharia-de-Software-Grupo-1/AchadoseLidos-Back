import { AppError } from './AppError';
import { ErrorMessages } from './ErrorMessages';

export class TokenNotProvided extends AppError {
  constructor() {
    super(ErrorMessages.tokenNotProvided, 401);
  }
}
