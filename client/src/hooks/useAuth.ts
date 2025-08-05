// Simplified auth hook for non-authenticated blog
export function useAuth() {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  };
}