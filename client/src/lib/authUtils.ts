// Simplified auth utils for non-authenticated blog
export function isUnauthorizedError(error: Error): boolean {
  return false; // Never unauthorized since no auth
}