'use client'
import { useMotionValue, useSpring, useTransform } from 'motion/react'
import { createContext, use, useState } from 'react'
import type { MotionValue, SpringOptions } from 'motion/react'

const ImageComparisonContext = createContext<
  | {
      sliderPosition: number
      setSliderPosition: (pos: number) => void
      motionSliderPosition: MotionValue<number>
    }
  | undefined
>(undefined)

export interface ImageComparisonProps {
  children: React.ReactNode
  className?: string
  enableHover?: boolean
  springOptions?: SpringOptions
}

const DEFAULT_SPRING_OPTIONS = {
  bounce: 0,
  duration: 0,
}

function ImageComparison({
  children,
  className,
  enableHover,
  springOptions,
}: ImageComparisonProps) {
  const [isDragging, setIsDragging] = useState(false)
  const motionValue = useMotionValue(50)
  const motionSliderPosition = useSpring(
    motionValue,
    springOptions ?? DEFAULT_SPRING_OPTIONS,
  )
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleDrag = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging && !enableHover) return

    const containerRect = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect()
    const x =
      'touches' in event
        ? event.touches[0].clientX - containerRect.left
        : (event as React.MouseEvent).clientX - containerRect.left

    const percentage = Math.min(
      Math.max((x / containerRect.width) * 100, 0),
      100,
    )
    motionValue.set(percentage)
    setSliderPosition(percentage)
  }

  return (
    <ImageComparisonContext
      // eslint-disable-next-line react/no-unstable-context-value
      value={{ sliderPosition, setSliderPosition, motionSliderPosition }}
    >
      <div
        className={cn(
          'relative overflow-hidden select-none',
          enableHover && 'cursor-ew-resize',
          className,
        )}
        onMouseMove={handleDrag}
        onMouseDown={() => !enableHover && setIsDragging(true)}
        onMouseUp={() => !enableHover && setIsDragging(false)}
        onMouseLeave={() => !enableHover && setIsDragging(false)}
        onTouchMove={handleDrag}
        onTouchStart={() => !enableHover && setIsDragging(true)}
        onTouchEnd={() => !enableHover && setIsDragging(false)}
      >
        {children}
      </div>
    </ImageComparisonContext>
  )
}

const ImageComparisonImage = ({
  className,
  alt,
  src,
  position,
}: {
  className?: string
  alt: string
  src: string
  position: 'left' | 'right'
}) => {
  const { motionSliderPosition } = use(ImageComparisonContext)!
  const leftClipPath = useTransform(
    motionSliderPosition,
    (value) => `inset(0 0 0 ${value}%)`,
  )
  const rightClipPath = useTransform(
    motionSliderPosition,
    (value) => `inset(0 ${100 - value}% 0 0)`,
  )

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn('absolute inset-0 h-full w-full object-cover', className)}
      style={{
        clipPath: position === 'left' ? leftClipPath : rightClipPath,
      }}
    />
  )
}

const ImageComparisonSlider = ({
  className,
  children,
}: {
  className: string
  children?: React.ReactNode
}) => {
  const { motionSliderPosition } = use(ImageComparisonContext)!

  const left = useTransform(motionSliderPosition, (value) => `${value}%`)

  return (
    <motion.div
      className={cn('absolute top-0 bottom-0 w-1 cursor-ew-resize', className)}
      style={{
        left,
      }}
    >
      {children}
    </motion.div>
  )
}

export { ImageComparison, ImageComparisonImage, ImageComparisonSlider }
