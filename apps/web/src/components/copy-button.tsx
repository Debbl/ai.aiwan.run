'use client'
import { Button } from '@heroui/react'
import { useState } from 'react'
import { CheckIcon, CopyIcon } from '../icons'
import type { ButtonProps } from '@heroui/react'
import type { ClassName } from '../app/type'

const CopyButtonIcon = ({ isCopied, ...props }: { isCopied: boolean } & Required<ClassName>) => {
  if (isCopied) {
    return <CheckIcon {...props} />
  }

  return <CopyIcon {...props} />
}

const MotionButton = motion.create(Button)

export default function CopyButton({
  code,
  className,
  isDisabled,
}: {
  code: string
} & ClassName &
  ButtonProps) {
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
      className={className}
      onPress={handleCopy}
      whileTap={{ scale: 0.9 }}
      isIconOnly
      size='md'
      color={isCopied ? 'success' : 'default'}
      isDisabled={isDisabled}
    >
      <CopyButtonIcon isCopied={isCopied} className={cn('size-4', isCopied && 'text-green-500')} />
      <span className='sr-only'>Copy</span>
    </MotionButton>
  )
}
