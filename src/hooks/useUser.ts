import { useSession } from '~/lib/auth-client'

export function useUser() {
  const { data } = useSession()

  const values = useSWR(
    data?.user.id ? [contract.getCredits.path, data?.user.id] : null,
    async ([_, id]) => {
      const res = await api.getCredits({
        query: {
          userId: id,
        },
      })

      if (res.status !== 200) {
        return null
      }

      return res.body
    },
  )

  return values
}
