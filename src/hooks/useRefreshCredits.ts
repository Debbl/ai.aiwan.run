import { useSWRConfig } from 'swr'

export function useRefreshCredits() {
  const { mutate } = useSWRConfig()

  return {
    refreshCredits: useCallback(() => {
      mutate(contract.getUser.path)
    }, [mutate]),
  }
}
