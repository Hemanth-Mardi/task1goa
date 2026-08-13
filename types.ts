export type Mode = 'pfp' | 'id'

export type AppStage = 'hero' | 'form' | 'upload' | 'processing' | 'result'

export interface BuilderInfo {
  name: string
  stack: string
  xUsername?: string
  githubUsername?: string
}

export interface ProcessedPhoto {
  /** The square-cropped, browser-decoded source image, ready to be drawn into a frame. */
  image: HTMLImageElement
}
