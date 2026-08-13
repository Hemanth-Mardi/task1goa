import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ImagePlus, UploadCloud } from 'lucide-react'

interface UploadZoneProps {
  onFile: (file: File) => void
  onBack: () => void
  error: string | null
}

export default function UploadZone({ onFile, onBack, error }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      const file = fileList?.[0]
      if (!file) return
      onFile(file)
    },
    [onFile],
  )

  return (
    <section className="relative min-h-[100svh] flex flex-col px-5 sm:px-8 py-8 max-w-2xl mx-auto w-full">
      <button
        onClick={onBack}
        className="self-start inline-flex items-center gap-1.5 text-sand/60 hover:text-sand font-mono text-xs tracking-widest transition-colors mb-8"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        BACK
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">Drop your photo here</h2>
        <p className="text-sand/60 mb-8 max-w-sm">
          We&rsquo;ll fit it into your frame automatically — no cropping needed.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={`w-full aspect-[4/3] sm:aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors glass ${
            isDragging ? 'border-rust bg-rust/5' : 'border-line hover:border-gold/50'
          }`}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload your photo. Tap to browse, or drag and drop a JPG, PNG, or HEIC file."
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-goa-sunset flex items-center justify-center">
            {isDragging ? (
              <UploadCloud size={28} className="text-ink" aria-hidden="true" />
            ) : (
              <ImagePlus size={28} className="text-ink" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="font-display font-semibold text-lg text-sand">
              {isDragging ? 'Drop it right here' : 'Upload your photo'}
            </p>
            <p className="font-mono text-[11px] tracking-widest text-sand/50 mt-1">JPG · PNG · HEIC</p>
          </div>
          <p className="font-mono text-[11px] tracking-widest text-sand/40">TAP TO BROWSE OR DRAG HERE</p>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mt-5 text-rust font-mono text-sm"
          >
            {error}
          </motion.p>
        )}

        <p className="mt-8 font-mono text-[11px] tracking-widest text-sand/40">
          YOUR PHOTO STAYS ON YOUR DEVICE — NOTHING IS UPLOADED TO A SERVER
        </p>
      </div>
    </section>
  )
}
