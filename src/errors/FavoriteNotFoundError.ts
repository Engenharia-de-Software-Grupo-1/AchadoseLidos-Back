import { AppError } from './AppError';
import { ErrorMessages } from './ErrorMessages';

export class FavoriteNotFoundError extends AppError {
  constructor() {
    super(ErrorMessages.favoriteNotFound, 404);
  }
}
