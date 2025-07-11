import { useSession } from '~/lib/auth-client'

export function useUser() {
  const { data, isPending } = useSession()

  const values = api.getCredits.useSWR(
    {
      query: {
        userId: data?.user.id || '',
      },
    },
    {
      enabled: !!data?.user.id,
      revalidateIfStale: false,
    },
  )

  const isLoaded = useMemo(() => {
    return !isPending && !values.isLoading
  }, [isPending, values.isLoading])

  return {
    ...values,
    isLoaded,
  }
}
