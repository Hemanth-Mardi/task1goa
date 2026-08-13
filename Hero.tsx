import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { Mode } from '../types'

interface HeroProps {
  mode: Mode
  onModeChange: (mode: Mode) => void
  onStart: () => void
}

export default function Hero({ mode, onModeChange, onStart }: HeroProps) {
  return (
    <section className="relative overflow-hidden min-h-[100svh] flex flex-col">
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid-fade" aria-hidden="true" />
      <div className="absolute inset-0 noise-bg" aria-hidden="true" />

      {/* Floating geometric accents */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-goa-sunset opacity-20 blur-3xl animate-float"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -left-20 w-56 h-56 rounded-full bg-sea/20 blur-3xl animate-floatSlow"
        aria-hidden="true"
      />
      <div
        className="hidden sm:block absolute top-24 right-[12%] w-3 h-3 rotate-45 border border-gold/50 animate-floatSlow"
        aria-hidden="true"
      />
      <div
        className="hidden sm:block absolute bottom-40 left-[10%] w-4 h-4 rounded-full border border-rust/50 animate-float"
        aria-hidden="true"
      />

      <nav className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-goa-sunset flex items-center justify-center font-display font-bold text-ink text-sm">
            H
          </div>
          <span className="font-mono text-xs tracking-widest text-sand/70">HH GOA / 2026</span>
        </div>
        <span className="font-mono text-[11px] tracking-widest text-sea/80 hidden xs:inline">#FrameInGoa</span>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 sm:px-8 text-center max-w-3xl mx-auto w-full py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-line font-mono text-[11px] tracking-widest text-gold mb-6"
        >
          <Sparkles size={12} aria-hidden="true" />
          HACKER HOUSE GOA · SHORTLISTING TASK
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display font-bold leading-[0.95] text-[13vw] xs:text-6xl sm:text-7xl tracking-tight"
        >
          <span className="block text-sand">FRAME YOUR</span>
          <span className="block shimmer-text">BUILDER</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mt-6 text-base sm:text-lg text-sand/70 max-w-md"
        >
          Turn your photo into your HH Goa 2026 builder PFP. Upload. Frame. Share.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-9 inline-flex p-1 rounded-full glass border border-line"
          role="tablist"
          aria-label="Choose frame mode"
        >
          <button
            role="tab"
            aria-selected={mode === 'pfp'}
            onClick={() => onModeChange('pfp')}
            className={`px-4 sm:px-5 py-2 rounded-full font-mono text-xs tracking-wide transition-colors ${
              mode === 'pfp' ? 'bg-sand text-ink' : 'text-sand/60 hover:text-sand'
            }`}
          >
            PFP Frame
          </button>
          <button
            role="tab"
            aria-selected={mode === 'id'}
            onClick={() => onModeChange('id')}
            className={`px-4 sm:px-5 py-2 rounded-full font-mono text-xs tracking-wide transition-colors ${
              mode === 'id' ? 'bg-sand text-ink' : 'text-sand/60 hover:text-sand'
            }`}
          >
            Builder ID
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 bg-goa-sunset text-ink font-display font-semibold text-base sm:text-lg px-7 sm:px-8 py-4 rounded-full shadow-[0_8px_40px_-8px_rgba(255,90,54,0.6)] transition-transform active:scale-95 hover:scale-[1.03]"
          >
            Create My Frame
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
          <p className="mt-4 font-mono text-[11px] tracking-widest text-sand/50">
            NO LOGIN · FREE · READY IN SECONDS
          </p>
        </motion.div>
      </div>
    </section>
  )
}
