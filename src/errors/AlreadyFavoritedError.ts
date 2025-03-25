import { AppError } from './AppError';
import { ErrorMessages } from './ErrorMessages';

export class AlreadyFavoritedError extends AppError {
  constructor() {
    super(ErrorMessages.alreadyFavorited, 400);
  }
}
