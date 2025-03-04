export function getErrorMessage(error: unknown, messageDefault: string) {
  return error instanceof Error ? error.message : messageDefault;
}
