import { useUser } from './useUser'

export function useRefreshCredits() {
  const { mutate } = useUser()

  return {
    refreshCredits: useCallback(() => {
      mutate()
    }, [mutate]),
  }
}
