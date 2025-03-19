import { ErrorMessages } from '../../errors/ErrorMessages';
import { ensureSelfTargetedAction } from '../ensureSelfTargetedAction';

describe('ensureSelfTargetedAction', () => {
  it('should throw invalidToken error if authenticatedAccountToken is null', () => {
    expect(() => {
      ensureSelfTargetedAction('123', null);
    }).toThrow(ErrorMessages.invalidToken);
  });

  it('should throw invalidToken error if authenticatedAccountToken is not an object', () => {
    expect(() => {
      ensureSelfTargetedAction('123', 'invalidToken');
    }).toThrow(ErrorMessages.invalidToken);
  });

  it('should throw invalidToken error if authenticatedAccountToken does not have an id property', () => {
    expect(() => {
      ensureSelfTargetedAction('123', {});
    }).toThrow(ErrorMessages.invalidToken);
  });

  it('should throw noPermissionForAction if targetAccountId does not match authenticatedAccountToken.id', () => {
    expect(() => {
      ensureSelfTargetedAction('123', { id: '456' });
    }).toThrow(ErrorMessages.noPermissionForAction);
  });

  it('should not throw an error if targetAccountId matches authenticatedAccountToken.id', () => {
    expect(() => {
      ensureSelfTargetedAction('123', { id: '123' });
    }).not.toThrow();
  });
});
