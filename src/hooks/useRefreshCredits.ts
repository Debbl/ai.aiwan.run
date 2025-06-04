import { useSWRConfig } from 'swr'
import { useSession } from '~/lib/auth-client'

export function useRefreshCredits() {
  const { mutate } = useSWRConfig()
  const { data } = useSession()

  return {
    refreshCredits: useCallback(() => {
      mutate([contract.getCredits.path, data?.user.id])
    }, [mutate, data?.user.id]),
  }
}
