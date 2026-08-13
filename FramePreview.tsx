import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = ['FRAMING YOUR BUILDER...', 'ADDING THE GOA ENERGY...', 'ALMOST THERE...']

interface FramePreviewProps {
  previewSrc: string
}

export default function FramePreview({ previewSrc }: FramePreviewProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1))
    }, 550)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 py-8" aria-live="polite">
      <div className="relative p-[2px] rounded-3xl bg-goa-sunset">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-[22px] overflow-hidden bg-ink">
          <img src={previewSrc} alt="" className="w-full h-full object-cover blur-md scale-110 opacity-70" />
          <div className="absolute inset-0 bg-ink/30" />
          <motion.div
            className="absolute inset-x-0 h-1 bg-gold/80"
            initial={{ top: '0%' }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="mt-8 h-6 relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-xs tracking-widest text-gold"
          >
            {MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  )
}
