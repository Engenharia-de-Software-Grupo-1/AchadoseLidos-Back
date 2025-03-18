import { AppError } from '@src/errors/AppError';

import { ErrorMessages } from './ErrorMessages';

const ensureSelfTargetedAction = (targetAccountId: string | number, authenticatedAccountToken: unknown) => {
  if (
    !authenticatedAccountToken ||
    typeof authenticatedAccountToken !== 'object' ||
    !('id' in authenticatedAccountToken)
  ) {
    throw new AppError(ErrorMessages.invalidToken, 401);
  }

  if (targetAccountId !== authenticatedAccountToken.id) {
    throw new AppError(ErrorMessages.noPermissionForAction, 403);
  }
};

export { ensureSelfTargetedAction };
