import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import ShareButtons from './ShareButtons'

interface ResultScreenProps {
  resultSrc: string
  onDownload: () => void
  onShare: () => void
  onReset: () => void
}

export default function ResultScreen({ resultSrc, onDownload, onShare, onReset }: ResultScreenProps) {
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = () => {
    onDownload()
    setDownloaded(true)
  }

  const handleShare = () => {
    if (!downloaded) {
      handleDownload()
    }
    onShare()
  }

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center px-5 sm:px-8 py-10 max-w-md mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-6"
      >
        <p className="font-mono text-[11px] tracking-widest text-sea mb-2">YOU&rsquo;RE READY FOR GOA</p>
        <h2 className="font-display font-bold text-2xl sm:text-3xl">Your HH Goa PFP is ready</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.25 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(255,90,54,0.35)] mb-8"
      >
        <img src={resultSrc} alt="Your generated HH Goa 2026 branded frame" className="w-full h-auto block" />
      </motion.div>

      <ShareButtons onDownload={handleDownload} onShare={handleShare} onReset={onReset} />

      {downloaded && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-sea"
        >
          <CheckCircle2 size={13} aria-hidden="true" />
          SAVED — ATTACH IT WHEN YOU SHARE ON X
        </motion.p>
      )}
    </section>
  )
}
