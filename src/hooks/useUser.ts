import { useSession } from '~/lib/auth-client'

export function useUser() {
  const { data } = useSession()

  const values = api.getCredits.useSWR(
    {
      query: {
        userId: data?.user.id || '',
      },
    },
    {
      enabled: !!data?.user.id,
    },
  )

  return values
}
