import { AppError } from './AppError';
import { ErrorMessages } from './ErrorMessages';

export class ProdutoNotFoundError extends AppError {
  constructor() {
    super(ErrorMessages.produtoNotFound, 404);
  }
}
