import { Loader2Icon } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

export function Spinner({ className, ...props }: LucideProps) {
  return <Loader2Icon className={cn('animate-spin', className)} {...props} />
}
