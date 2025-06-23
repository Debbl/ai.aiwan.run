/* eslint-disable react-web-api/no-leaked-timeout */
'use client'

import { Globe, Lightbulb, Mic, Paperclip, Send } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

const PLACEHOLDERS = [
  'Generate website with HextaUI',
  'Create a new project with Next.js',
  'What is the meaning of life?',
  'What is the best way to learn React?',
  'How to cook a delicious meal?',
  'Summarize this article',
]

const AIChatInput = () => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [thinkActive, setThinkActive] = useState(false)
  const [deepSearchActive, setDeepSearchActive] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue) return

    const interval = setInterval(() => {
      setShowPlaceholder(false)
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
        setShowPlaceholder(true)
      }, 400)
    }, 3000)

    return () => clearInterval(interval)
  }, [isActive, inputValue])

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!inputValue) setIsActive(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [inputValue])

  const handleActivate = () => setIsActive(true)

  const containerVariants = {
    collapsed: {
      height: 68,
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
      transition: { type: 'spring', stiffness: 120, damping: 18 },
    },
    expanded: {
      height: 128,
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.16)',
      transition: { type: 'spring', stiffness: 120, damping: 18 },
    },
  } as const

  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.025 } },
    exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  }

  const letterVariants = {
    initial: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 10,
    },
    animate: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        opacity: { duration: 0.25 },
        filter: { duration: 0.4 },
        y: { type: 'spring', stiffness: 80, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: 'blur(12px)',
      y: -10,
      transition: {
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 },
        y: { type: 'spring', stiffness: 80, damping: 20 },
      },
    },
  } as const

  return (
    <div className='flex w-full items-center justify-center text-black'>
      <motion.div
        ref={wrapperRef}
        className='w-full max-w-3xl'
        variants={containerVariants}
        animate={isActive || inputValue ? 'expanded' : 'collapsed'}
        initial='collapsed'
        style={{ overflow: 'hidden', borderRadius: 32, background: '#fff' }}
        onClick={handleActivate}
      >
        <div className='flex h-full w-full flex-col items-stretch'>
          {/* Input Row */}
          <div className='flex w-full max-w-3xl items-center gap-2 rounded-full bg-white p-3'>
            <button
              className='rounded-full p-3 transition hover:bg-gray-100'
              title='Attach file'
              type='button'
              tabIndex={-1}
            >
              <Paperclip size={20} />
            </button>

            {/* Text Input & Placeholder */}
            <div className='relative flex-1'>
              <input
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='w-full flex-1 rounded-md border-0 bg-transparent py-2 text-base font-normal outline-0'
                style={{ position: 'relative', zIndex: 1 }}
                onFocus={handleActivate}
              />
              <div className='pointer-events-none absolute top-0 left-0 flex h-full w-full items-center px-3 py-2'>
                <AnimatePresence mode='wait'>
                  {showPlaceholder && !isActive && !inputValue && (
                    <motion.span
                      key={placeholderIndex}
                      className='pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-gray-400 select-none'
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        zIndex: 0,
                      }}
                      variants={placeholderContainerVariants}
                      initial='initial'
                      animate='animate'
                      exit='exit'
                    >
                      {PLACEHOLDERS[placeholderIndex]
                        .split('')
                        .map((char, i) => (
                          <motion.span
                            // eslint-disable-next-line react/no-array-index-key
                            key={i}
                            variants={letterVariants}
                            style={{ display: 'inline-block' }}
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </motion.span>
                        ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              className='rounded-full p-3 transition hover:bg-gray-100'
              title='Voice input'
              type='button'
              tabIndex={-1}
            >
              <Mic size={20} />
            </button>
            <button
              className='flex items-center justify-center gap-1 rounded-full bg-black p-3 font-medium text-white hover:bg-zinc-700'
              title='Send'
              type='button'
              tabIndex={-1}
            >
              <Send size={18} />
            </button>
          </div>

          {/* Expanded Controls */}
          <motion.div
            className='flex w-full items-center justify-start px-4 text-sm'
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
                pointerEvents: 'none' as const,
                transition: { duration: 0.25 },
              },
              visible: {
                opacity: 1,
                y: 0,
                pointerEvents: 'auto' as const,
                transition: { duration: 0.35, delay: 0.08 },
              },
            }}
            initial='hidden'
            animate={isActive || inputValue ? 'visible' : 'hidden'}
            style={{ marginTop: 8 }}
          >
            <div className='flex items-center gap-3'>
              {/* Think Toggle */}
              <button
                className={`group flex items-center gap-1 rounded-full px-4 py-2 font-medium transition-all ${
                  thinkActive
                    ? 'bg-blue-600/10 text-blue-950 outline outline-blue-600/60'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title='Think'
                type='button'
                onClick={(e) => {
                  e.stopPropagation()
                  setThinkActive((a) => !a)
                }}
              >
                <Lightbulb
                  className='transition-all group-hover:fill-yellow-300'
                  size={18}
                />
                Think
              </button>

              {/* Deep Search Toggle */}
              <motion.button
                className={`flex items-center justify-start gap-1 overflow-hidden rounded-full px-4 py-2 font-medium whitespace-nowrap transition ${
                  deepSearchActive
                    ? 'bg-blue-600/10 text-blue-950 outline outline-blue-600/60'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title='Deep Search'
                type='button'
                onClick={(e) => {
                  e.stopPropagation()
                  setDeepSearchActive((a) => !a)
                }}
                initial={false}
                animate={{
                  width: deepSearchActive ? 125 : 36,
                  paddingLeft: deepSearchActive ? 8 : 9,
                }}
              >
                <div className='flex-1'>
                  <Globe size={18} />
                </div>
                <motion.span
                  className='pb-[2px]'
                  initial={false}
                  animate={{
                    opacity: deepSearchActive ? 1 : 0,
                  }}
                >
                  Deep Search
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export { AIChatInput }
