function Skeleton({
  className,
  isLoaded = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  isLoaded?: boolean
}) {
  return (
    <div
      data-slot='skeleton'
      className={cn(
        'overflow-hidden rounded-md',
        {
          'bg-accent animate-pulse': !isLoaded,
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Skeleton }
