export function useUser() {
  const values = useSWR(contract.getUser.path, async () => {
    const res = await api.getUser()

    if (res.status !== 200) {
      return null
    }

    return res.body
  })

  return values
}
