import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { BuilderInfo } from '../types'
import { getBuilderTitle } from '../utils/builderTitles'

interface BuilderCardFormProps {
  onSubmit: (info: BuilderInfo) => void
  onBack: () => void
  initial?: BuilderInfo
}

export default function BuilderCardForm({ onSubmit, onBack, initial }: BuilderCardFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [stack, setStack] = useState(initial?.stack ?? '')
  const [xUsername, setXUsername] = useState(initial?.xUsername ?? '')
  const [githubUsername, setGithubUsername] = useState(initial?.githubUsername ?? '')

  const previewTitle = stack.trim() ? getBuilderTitle(stack) : null
  const canContinue = name.trim().length > 0 && stack.trim().length > 0

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!canContinue) return
    onSubmit({
      name: name.trim(),
      stack: stack.trim(),
      xUsername: xUsername.trim() || undefined,
      githubUsername: githubUsername.trim() || undefined,
    })
  }

  return (
    <section className="relative min-h-[100svh] flex flex-col px-5 sm:px-8 py-8 max-w-lg mx-auto w-full">
      <button
        onClick={onBack}
        className="self-start inline-flex items-center gap-1.5 text-sand/60 hover:text-sand font-mono text-xs tracking-widest transition-colors mb-8"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        BACK
      </button>

      <div className="flex-1 flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-2">Your builder details</h2>
          <p className="text-sand/60 mb-8">This goes on your HH Goa 2026 builder pass.</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="block font-mono text-[11px] tracking-widest text-sand/50 mb-2">
                NAME
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Arunkumar P"
                maxLength={40}
                required
                className="w-full bg-panel border border-line rounded-xl px-4 py-3.5 text-sand placeholder:text-sand/30 focus:border-gold outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="stack" className="block font-mono text-[11px] tracking-widest text-sand/50 mb-2">
                STACK / ROLE
              </label>
              <input
                id="stack"
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                placeholder="Full Stack, AI, DevOps..."
                maxLength={40}
                required
                className="w-full bg-panel border border-line rounded-xl px-4 py-3.5 text-sand placeholder:text-sand/30 focus:border-gold outline-none transition-colors"
              />
              {previewTitle && (
                <p className="mt-2 font-mono text-[11px] tracking-widest text-gold">
                  YOUR TITLE: &ldquo;{previewTitle}&rdquo;
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="x" className="block font-mono text-[11px] tracking-widest text-sand/50 mb-2">
                  X USERNAME
                </label>
                <input
                  id="x"
                  value={xUsername}
                  onChange={(e) => setXUsername(e.target.value)}
                  placeholder="optional"
                  maxLength={20}
                  className="w-full bg-panel border border-line rounded-xl px-4 py-3.5 text-sand placeholder:text-sand/30 focus:border-gold outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="gh" className="block font-mono text-[11px] tracking-widest text-sand/50 mb-2">
                  GITHUB
                </label>
                <input
                  id="gh"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="optional"
                  maxLength={39}
                  className="w-full bg-panel border border-line rounded-xl px-4 py-3.5 text-sand placeholder:text-sand/30 focus:border-gold outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!canContinue}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-goa-sunset text-ink font-display font-semibold text-base px-7 py-4 rounded-full transition-all active:scale-95 hover:scale-[1.01] disabled:opacity-30 disabled:pointer-events-none"
            >
              Continue to Photo
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
