'use client'
import { LucideDatabase } from 'lucide-react'
import { cls } from 'twl'
import { Avatar } from '~/components/avatar'
import { Favicon } from '~/components/icons'
import { Button } from '~/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuTriggerWithoutChevron,
} from '~/components/ui/navigation-menu'
import { Skeleton } from '~/components/ui/skeleton'
import { useUser } from '~/hooks/useUser'
import { signOut } from '~/lib/auth-client'

function ListItem({
  title,
  href,
  description,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & {
  onClick?: () => void
  href?: string
  description: string
}) {
  const Content = (
    <>
      <div className='text-sm leading-none font-medium text-nowrap'>
        {title}
      </div>
      <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
        {description}
      </p>
    </>
  )

  return (
    <li className='w-[200px] max-w-[80vw]' {...props}>
      <NavigationMenuLink asChild>
        {href ? (
          <Link href={href}>{Content}</Link>
        ) : (
          <div onClick={onClick}>{Content}</div>
        )}
      </NavigationMenuLink>
    </li>
  )
}

export function Header() {
  const { data } = useUser()

  const credits = data?.credits ?? 100

  const apps = [
    {
      label: 'AI Fortune teller',
      href: '/ai-fortune-teller',
      description: 'Tell your future',
    },
    {
      label: 'AI Ghibli generator',
      href: '/ai-ghibli-generator',
      description: 'Generate Ghibli-style images',
    },
    {
      label: 'AI Image Generator',
      href: '/ai-image-generator',
      description: 'Generate images with AI',
    },
  ]

  const browserList = [
    {
      label: 'Object Detector',
      href: '/browser/object-detector',
      description: 'Detect objects in images, running on your browser',
    },
    {
      label: 'Segment Anything',
      href: '/browser/segment-anything',
      description: 'Segment anything in images, running on your browser',
    },
  ]

  const userList = [
    {
      label: 'Sign In',
      href: '/sign-in',
      description: 'Sign in to your account',
    },
    {
      label: 'Sign Up',
      href: '/sign-up',
      description: 'Sign up for an account',
    },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className='bg-background sticky top-0 z-10 flex w-full items-center justify-between border-b px-4 py-1'>
      <Link href='/'>
        <Favicon />
      </Link>
      <div className='flex items-center gap-2'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Link href='/'>Apps</Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-fit gap-1'>
                  {apps.map((item) => (
                    <ListItem
                      key={item.href}
                      title={item.label}
                      href={item.href}
                      description={item.description}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Link href='/browser'>Browser</Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-fit gap-1'>
                  {browserList.map((item) => (
                    <ListItem
                      key={item.href}
                      title={item.label}
                      href={item.href}
                      description={item.description}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem className='flex items-center justify-center'>
              <NavigationMenuTriggerWithoutChevron
                className='cursor-default p-0'
                asChild
              >
                <div className='flex items-center justify-center gap-2'>
                  {data?.name ? (
                    <Avatar size={30} rounded={15} username={data.name} />
                  ) : (
                    <Skeleton
                      className='flex min-h-8 min-w-8 items-center justify-center rounded-full'
                      isLoaded={!!data}
                    >
                      <Link
                        href='/sign-in'
                        className={cls`flex items-center gap-1 ${!data && 'hidden'}`}
                      >
                        <Button variant='link'>Sign In</Button>
                      </Link>
                    </Skeleton>
                  )}
                </div>
              </NavigationMenuTriggerWithoutChevron>
              <NavigationMenuContent>
                <ul className='grid w-fit gap-1'>
                  {!data?.name ? (
                    userList.map((item) => (
                      <ListItem
                        key={item.href}
                        title={item.label}
                        href={item.href}
                        description={item.description}
                      />
                    ))
                  ) : (
                    <ListItem
                      title='Sign Out'
                      onClick={handleSignOut}
                      description='Sign out of your account'
                    />
                  )}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Skeleton
          className='flex min-h-8 min-w-8 items-center justify-center'
          isLoaded={!!data}
        >
          <div className={cls`flex items-center gap-1 ${!data && 'hidden'}`}>
            <span className='text-sm'>{credits}</span>
            <LucideDatabase className='size-3' />
          </div>
        </Skeleton>
      </div>
    </div>
  )
}
