'use client'
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
  const [callbackURL] = useQueryState(
    'redirect',
    parseAsString.withDefault('/'),
  )

  const session = useSession()

  useEffect(() => {
    if (session.data) {
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

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='mx-2 flex w-[500px] max-w-full flex-col gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit}>
              <div className='flex flex-col gap-6'>
                <div className='grid gap-3'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    name='email'
                    id='email'
                    type='email'
                    placeholder='Enter your email'
                    required
                  />
                </div>
                <div className='grid gap-3'>
                  <div className='flex items-center'>
                    <Label htmlFor='password'>Password</Label>
                  </div>
                  <Input
                    name='password'
                    id='password'
                    type='password'
                    placeholder='Enter your password'
                    required
                  />
                </div>
                <div className='flex flex-col gap-3'>
                  <Button type='submit' className='w-full'>
                    Login
                  </Button>
                </div>
              </div>
              <div className='mt-4 text-center text-sm'>
                Don&apos;t have an account?{' '}
                <Link href='/sign-up' className='underline underline-offset-4'>
                  Sign up
                </Link>
              </div>
            </form>
            <div className='mt-4 flex flex-col gap-2'>
              <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-background text-muted-foreground relative z-10 px-2'>
                  Or continue with
                </span>
              </div>
              <Button
                variant='outline'
                className='w-full'
                onClick={handleGoogleLogin}
              >
                <SiGoogle />
                Login with Google
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={handleGitHubLogin}
              >
                <SiGithub />
                Login with GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
