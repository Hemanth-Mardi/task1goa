import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Hero from './components/Hero'
import UploadZone from './components/UploadZone'
import FramePreview from './components/FramePreview'
import ResultScreen from './components/ResultScreen'
import BuilderCardForm from './components/BuilderCard'
import Footer from './components/Footer'
import type { AppStage, BuilderInfo, Mode } from './types'
import { loadImageFromFile, smartSquareCrop, validateFile } from './utils/imageProcessor'
import { ensureFontsReady, renderBuilderCard, renderPfpFrame } from './utils/frameRenderer'
import { downloadCanvasAsPng, openShareToX } from './utils/share'

const MIN_PROCESSING_MS = 900

function App() {
  const [stage, setStage] = useState<AppStage>('hero')
  const [mode, setMode] = useState<Mode>('pfp')
  const [builderInfo, setBuilderInfo] = useState<BuilderInfo | undefined>(undefined)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [resultSrc, setResultSrc] = useState<string | null>(null)

  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const resetAll = useCallback(() => {
    setStage('hero')
    setUploadError(null)
    setPreviewSrc(null)
    setResultSrc(null)
    resultCanvasRef.current = null
  }, [])

  const goToUpload = useCallback(() => {
    setUploadError(null)
    setStage(mode === 'id' ? 'form' : 'upload')
  }, [mode])

  const handleBuilderSubmit = useCallback((info: BuilderInfo) => {
    setBuilderInfo(info)
    setStage('upload')
  }, [])

  const processFile = useCallback(
    async (file: File) => {
      const validation = validateFile(file)
      if (!validation.ok) {
        setUploadError(validation.error ?? 'That file could not be used. Try another photo.')
        return
      }
      setUploadError(null)

      const localPreviewUrl = URL.createObjectURL(file)
      setPreviewSrc(localPreviewUrl)
      setStage('processing')

      const started = performance.now()

      try {
        const [img] = await Promise.all([loadImageFromFile(file), ensureFontsReady()])
        const squareCanvas = smartSquareCrop(img, 1080)

        const finalCanvas =
          mode === 'id' && builderInfo
            ? renderBuilderCard(squareCanvas, builderInfo, 1080)
            : renderPfpFrame(squareCanvas, 1080)

        resultCanvasRef.current = finalCanvas

        const elapsed = performance.now() - started
        const remaining = Math.max(0, MIN_PROCESSING_MS - elapsed)
        await new Promise((r) => setTimeout(r, remaining))

        const dataUrl = finalCanvas.toDataURL('image/png')
        setResultSrc(dataUrl)
        setStage('result')
      } catch (err) {
        const message = err instanceof Error ? err.message : "That image couldn't be processed. Try another photo."
        setUploadError(message)
        setStage('upload')
      }
    },
    [mode, builderInfo],
  )

  const handleDownload = useCallback(() => {
    if (!resultCanvasRef.current) return
    const filename = mode === 'id' ? 'hh-goa-2026-builder-id.png' : 'hh-goa-2026-pfp.png'
    downloadCanvasAsPng(resultCanvasRef.current, filename)
  }, [mode])

  const handleShare = useCallback(() => {
    openShareToX()
  }, [])

  const handleUploadBack = useCallback(() => {
    setUploadError(null)
    setStage(mode === 'id' ? 'form' : 'hero')
  }, [mode])

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {stage === 'hero' && (
            <motion.div key="hero" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Hero mode={mode} onModeChange={setMode} onStart={goToUpload} />
            </motion.div>
          )}

          {stage === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <BuilderCardForm onSubmit={handleBuilderSubmit} onBack={() => setStage('hero')} initial={builderInfo} />
            </motion.div>
          )}

          {stage === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <UploadZone onFile={processFile} onBack={handleUploadBack} error={uploadError} />
            </motion.div>
          )}

          {stage === 'processing' && previewSrc && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <FramePreview previewSrc={previewSrc} />
            </motion.div>
          )}

          {stage === 'result' && resultSrc && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ResultScreen resultSrc={resultSrc} onDownload={handleDownload} onShare={handleShare} onReset={resetAll} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {stage === 'hero' && <Footer />}
    </div>
  )
}

export default App
