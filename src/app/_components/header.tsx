'use client'
import { LucideDatabase } from 'lucide-react'
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
} from '~/components/ui/navigation-menu'
import { useUser } from '~/hooks/useUser'

function ListItem({
  title,
  href,
  description,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & {
  href: string
  description: string
}) {
  return (
    <li className='w-[200px] max-w-[80vw]' {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className='text-sm leading-none font-medium text-nowrap'>
            {title}
          </div>
          <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
            {description}
          </p>
        </Link>
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

  return (
    <div className='bg-background sticky top-0 z-10 flex w-full items-center justify-between border-b px-4 py-1'>
      <Link href='/'>
        <Favicon />
      </Link>
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-1'>
          <span className='text-sm'>{credits}</span>
          <LucideDatabase className='size-3' />
        </div>
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
          </NavigationMenuList>
        </NavigationMenu>
        <div className='flex items-center gap-2'>
          {data?.name ? (
            <Avatar size={32} rounded={16} username={data.name} />
          ) : (
            <Link href='/sign-in'>
              <Button variant='link'>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
