import Image from 'next/image'

export function Header() {
  return (
    <div className='bg-background sticky top-0 z-10 flex w-full items-center justify-between border-b px-4 py-2'>
      <Link href='/'>
        <Image src='/favicon.svg' alt='logo' width={24} height={24} />
      </Link>
      <div className='flex items-center gap-2'>
        <Link href='/browser'>Browser</Link>
      </div>
    </div>
  )
}
