import { TokenInvalidError } from '@src/errors/TokenInvalidError';
import { NoPermissionError } from '@src/errors/NoPermissionError';

export const ensureSelfTargetedAction = (id: string | number, authenticatedAccountToken: unknown) => {
  if (
    !authenticatedAccountToken ||
    typeof authenticatedAccountToken !== 'object' ||
    !('id' in authenticatedAccountToken)
  ) {
    throw new TokenInvalidError();
  }

  if (id !== authenticatedAccountToken.id) {
    throw new NoPermissionError();
  }
};
