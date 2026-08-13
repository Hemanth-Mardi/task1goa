const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
const ACCEPTED_EXT = /\.(jpe?g|png|webp|heic|heif)$/i
const MAX_FILE_BYTES = 30 * 1024 * 1024 // 30MB — generous ceiling for modern phone photos

export interface ValidationResult {
  ok: boolean
  error?: string
}

export function validateFile(file: File): ValidationResult {
  if (!file) {
    return { ok: false, error: 'No file selected. Choose a photo to continue.' }
  }
  if (file.size === 0) {
    return { ok: false, error: 'That file looks empty. Try a different photo.' }
  }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, error: 'That photo is too large. Try one under 30MB.' }
  }
  const typeOk = ACCEPTED_TYPES.includes(file.type.toLowerCase())
  const extOk = ACCEPTED_EXT.test(file.name)
  if (!typeOk && !extOk) {
    return { ok: false, error: 'Please upload a JPG, PNG, WEBP, or HEIC image.' }
  }
  return { ok: true }
}

/**
 * Reads a File into a decoded HTMLImageElement.
 * Relies on the browser's own image decoder, so HEIC works wherever the
 * OS/browser natively supports it (e.g. iOS Safari); unsupported browsers
 * will reject with a friendly error instead of a raw stack trace.
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("That image couldn't be read. Try another photo."))
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          reject(new Error("That image couldn't be processed. Try another photo."))
          return
        }
        resolve(img)
      }
      img.onerror = () =>
        reject(new Error('This browser can\u2019t open that file format. Try a JPG or PNG instead.'))
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Produces a square canvas from an arbitrary-aspect source image.
 * Portrait photos are biased slightly toward the top third (where faces
 * usually sit); landscape photos are centered. This keeps the subject
 * in frame without ever forcing the user through a manual crop step.
 */
export function smartSquareCrop(img: HTMLImageElement, outputSize = 1080): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = outputSize
  canvas.height = outputSize
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const { naturalWidth: w, naturalHeight: h } = img
  const side = Math.min(w, h)

  let sx = (w - side) / 2
  let sy = (h - side) / 2

  if (h > w) {
    // Portrait: bias the crop upward so faces (usually upper-middle) stay in frame.
    sy = Math.max(0, (h - side) * 0.28)
  }

  ctx.drawImage(img, sx, sy, side, side, 0, 0, outputSize, outputSize)
  return canvas
}
