import { ErrorMessages } from '../../errors/ErrorMessages';
import { ensureSelfTargetedAction } from '../authUtils';

describe('ensureSelfTargetedAction', () => {
  it('should throw invalidToken error if authToken is null', () => {
    expect(() => {
      ensureSelfTargetedAction(123, null);
    }).toThrow(ErrorMessages.invalidToken);
  });

  it('should throw invalidToken error if authToken is not an object', () => {
    expect(() => {
      ensureSelfTargetedAction(123, 'invalidToken');
    }).toThrow(ErrorMessages.invalidToken);
  });

  it('should throw invalidToken error if authToken does not have an id property', () => {
    expect(() => {
      ensureSelfTargetedAction(123, {});
    }).toThrow(ErrorMessages.invalidToken);
  });

  it('should throw noPermissionForAction if targetAccountId does not match authToken.id', () => {
    expect(() => {
      ensureSelfTargetedAction(123, { id: 456 });
    }).toThrow(ErrorMessages.noPermissionForAction);
  });

  it('should not throw an error if targetAccountId matches authToken.id', () => {
    expect(() => {
      ensureSelfTargetedAction(123, { id: 123 });
    }).not.toThrow();
  });
});
