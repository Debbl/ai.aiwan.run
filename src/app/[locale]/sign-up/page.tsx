'use client'
import { Trans } from '@lingui/react/macro'
import { parseAsString, useQueryState } from 'nuqs'
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
import { authClient } from '~/lib/auth-client'

export default function Page() {
  const [callbackURL] = useQueryState(
    'redirect',
    parseAsString.withDefault('/'),
  )

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!email || !password) {
      toast.warning('Please enter your email and password', {
        description:
          'Please enter your email and password to create your account',
      })
      return
    }

    if (password !== confirmPassword) {
      toast.warning('Passwords do not match', {
        description: 'Please enter the same password in both fields',
      })
      return
    }

    await authClient.signUp.email(
      {
        name: email,
        email,
        password,
        callbackURL,
      },
      {
        onError: (ctx) => {
          toast.warning(ctx.error.message)
        },
      },
    )
  }

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='mx-2 flex w-[500px] max-w-full flex-col gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans>Create to your account</Trans>
            </CardTitle>
            <CardDescription>
              <Trans>Enter your email below to create your account</Trans>
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
                    placeholder='Enter you email'
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
                    placeholder='Enter your password'
                    required
                  />
                </div>
                <div className='grid gap-3'>
                  <div className='flex items-center'>
                    <Label htmlFor='confirmPassword'>
                      <Trans>Confirm Password</Trans>
                    </Label>
                  </div>
                  <Input
                    name='confirmPassword'
                    id='confirmPassword'
                    type='password'
                    placeholder='Enter your password again'
                    required
                  />
                </div>
                <div className='flex flex-col gap-3'>
                  <Button type='submit' className='w-full'>
                    <Trans>Sign up</Trans>
                  </Button>
                </div>
              </div>
              <div className='mt-4 text-center text-sm'>
                <Trans>Already have an account?</Trans>{' '}
                <Link href='/sign-in' className='underline underline-offset-4'>
                  <Trans>Login</Trans>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
