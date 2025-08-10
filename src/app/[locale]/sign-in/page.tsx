'use client'
import { Trans, useLingui } from '@lingui/react/macro'
import { HatGlasses } from 'lucide-react'
import { redirect } from 'next/navigation'
import { parseAsString, useQueryState } from 'nuqs'
import { SiGithub, SiGoogle } from 'react-icons/si'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { authClient, useSession } from '~/lib/auth-client'

export default function Page() {
  const { t } = useLingui()
  const [callbackURL] = useQueryState(
    'redirect',
    parseAsString.withDefault('/'),
  )

  const session = useSession()

  useEffect(() => {
    if (session.data && !session.data.user.isAnonymous) {
      redirect('/')
    }
  }, [session.data])

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) return

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL,
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message)
        },
      },
    )
  }

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL,
    })
  }

  const handleGitHubLogin = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL,
    })
  }

  const handleAnonymousLogin = async () => {
    toast('Anonymous will not save your data', {
      position: 'top-center',
      description: 'You can login with your email and password later',
      action: {
        label: 'Continue',
        onClick: () => {
          authClient.signIn.anonymous()
        },
      },
    })
  }

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='mx-2 flex w-[500px] max-w-full flex-col gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>Login to your account</Trans>
            </CardTitle>
            <CardDescription>
              <Trans>Enter your email below to login to your account</Trans>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit}>
              <div className='flex flex-col gap-6'>
                <div className='grid gap-3'>
                  <Label htmlFor='email'>
                    <Trans>Email</Trans>
                  </Label>
                  <Input
                    name='email'
                    id='email'
                    type='email'
                    placeholder={t`Enter your email`}
                    required
                  />
                </div>
                <div className='grid gap-3'>
                  <div className='flex items-center'>
                    <Label htmlFor='password'>
                      <Trans>Password</Trans>
                    </Label>
                  </div>
                  <Input
                    name='password'
                    id='password'
                    type='password'
                    placeholder={t`Enter your password`}
                    required
                  />
                </div>
                <div className='flex flex-col gap-3'>
                  <Button type='submit' className='w-full'>
                    <Trans>Login</Trans>
                  </Button>
                </div>
              </div>
              <div className='mt-4 text-center text-sm'>
                {t`Don't have an account?`}{' '}
                <Link href='/sign-up' className='underline underline-offset-4'>
                  <Trans>Sign up</Trans>
                </Link>
              </div>
            </form>
            <div className='mt-4 flex flex-col gap-2'>
              <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-background text-muted-foreground relative z-10 px-2'>
                  <Trans>Or continue with</Trans>
                </span>
              </div>
              <Button
                variant='outline'
                className='w-full'
                onClick={handleGoogleLogin}
              >
                <SiGoogle />
                <Trans>Login with Google</Trans>
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={handleGitHubLogin}
              >
                <SiGithub />
                <Trans>Login with GitHub</Trans>
              </Button>
              {!session.data?.user.isAnonymous && (
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={handleAnonymousLogin}
                >
                  <HatGlasses />
                  <Trans>Login with Anonymous</Trans>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
