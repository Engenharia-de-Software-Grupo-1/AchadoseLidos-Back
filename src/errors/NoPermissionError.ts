import { AppError } from './AppError';
import { ErrorMessages } from './ErrorMessages';

export class NoPermissionError extends AppError {
  constructor() {
    super(ErrorMessages.noPermissionForAction, 403);
  }
}
