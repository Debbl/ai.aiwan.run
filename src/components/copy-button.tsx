'use client'
import { useState } from 'react'
import { CheckIcon, CopyIcon } from './icons'
import { Button } from './ui/button'
import type { ComponentProps } from 'react'
import type { ClassName } from '../app/type'

const CopyButtonIcon = ({
  isCopied,
  ...props
}: { isCopied: boolean } & Required<ClassName>) => {
  if (isCopied) {
    return <CheckIcon {...props} />
  }

  return <CopyIcon {...props} />
}

const MotionButton = motion.create(Button)

export default function CopyButton({
  code,
  ...props
}: {
  code: string
} & ComponentProps<typeof MotionButton>) {
  const [isCopied, setIsCopied] = useState(false)
  const handleCopy = () => {
    setIsCopied(true)
    navigator.clipboard.writeText(code)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  return (
    <MotionButton
      aria-label='Copy text'
      data-value={code}
      onClick={handleCopy}
      whileTap={{ scale: 0.9 }}
      {...props}
    >
      <CopyButtonIcon
        isCopied={isCopied}
        className={cn('size-4', isCopied && 'text-green-500')}
      />
      <span className='sr-only'>Copy</span>
    </MotionButton>
  )
}
