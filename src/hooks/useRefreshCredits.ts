import { useUser } from './useUser'

export function useRefreshCredits() {
  const { refetch } = useUser()

  return {
    refreshCredits: useCallback(() => {
      refetch()
    }, [refetch]),
  }
}
