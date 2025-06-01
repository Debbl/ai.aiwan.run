import { redirect, usePathname } from 'next/navigation'
import { useSession } from '~/lib/auth-client'

export function useAuthGuard() {
  const session = useSession()
  const pathname = usePathname()

  const handleAuthGuard = useCallback(() => {
    if (!session.data) {
      redirect(`/sign-in?redirect=${pathname}`)
    }
  }, [session])

  return {
    session,
    handleAuthGuard,
  }
}
