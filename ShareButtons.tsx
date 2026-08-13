import { Download, RotateCcw, Twitter } from 'lucide-react'

interface ShareButtonsProps {
  onDownload: () => void
  onShare: () => void
  onReset: () => void
}

export default function ShareButtons({ onDownload, onShare, onReset }: ShareButtonsProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      <button
        onClick={onDownload}
        className="w-full inline-flex items-center justify-center gap-2 bg-goa-sunset text-ink font-display font-semibold text-base px-6 py-4 rounded-full transition-transform active:scale-95 hover:scale-[1.01]"
      >
        <Download size={18} aria-hidden="true" />
        Download PNG
      </button>

      <button
        onClick={onShare}
        className="w-full inline-flex items-center justify-center gap-2 bg-panel border border-line text-sand font-display font-semibold text-base px-6 py-4 rounded-full transition-colors active:scale-95 hover:border-sea/60"
      >
        <Twitter size={18} className="text-sea" aria-hidden="true" />
        Share to X
      </button>

      <button
        onClick={onReset}
        className="w-full inline-flex items-center justify-center gap-2 text-sand/60 hover:text-sand font-mono text-xs tracking-widest px-6 py-3 transition-colors"
      >
        <RotateCcw size={13} aria-hidden="true" />
        CREATE ANOTHER
      </button>
    </div>
  )
}
